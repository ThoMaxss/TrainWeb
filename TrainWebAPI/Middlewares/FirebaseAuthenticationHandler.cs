using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;
using TrainWeb.Infrastructure.Services;

namespace TrainWebAPI.Middlewares
{
    public sealed class FirebaseAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly FirebaseService _firebaseService;
        private readonly IUserRepository _userRepository;

        public FirebaseAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            FirebaseService firebaseService,
            IUserRepository userRepository)
            : base(options, logger, encoder, clock)
        {
            _firebaseService = firebaseService;
            _userRepository = userRepository;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var authHeader = Request.Headers.Authorization.ToString();
            if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                Logger.LogDebug("No Authorization header present or not a Bearer token.");
                return AuthenticateResult.NoResult();
            }

            var idToken = authHeader["Bearer ".Length..].Trim();

            Logger.LogDebug("Attempting to verify Firebase token (first 8 chars): {prefix}", idToken?.Substring(0, Math.Min(8, idToken.Length)));
            var decoded = await _firebaseService.VerifyIdTokenAsync(idToken);
            if (decoded == null)
            {
                Logger.LogWarning("Firebase token verification failed for provided token prefix.");
                return AuthenticateResult.Fail("Invalid Firebase token");
            }

            Logger.LogDebug("Firebase token verified successfully, uid={uid}", decoded.Uid);

            var uid = decoded.Uid;

            // ===== helper: read claim from token =====
            bool TryGetClaimString(string key, out string value)
            {
                value = "";
                if (decoded.Claims != null && decoded.Claims.TryGetValue(key, out var obj) && obj != null)
                {
                    value = obj.ToString() ?? "";
                    return !string.IsNullOrWhiteSpace(value);
                }
                return false;
            }

            bool GetEmailVerifiedFromToken()
            {
                if (decoded.Claims != null && decoded.Claims.TryGetValue("email_verified", out var evObj))
                {
                    if (evObj is bool b) return b;
                    return bool.TryParse(evObj?.ToString(), out var v) && v;
                }
                return false;
            }

            var emailVerifiedFromToken = GetEmailVerifiedFromToken();

            // ===== 1) Lấy user Firestore =====
            var user = await _userRepository.GetByIdAsync(uid);

            bool emailVerified;
            string email;

            if (user == null)
            {
                // ===== 2) Bootstrap user vào Firestore (tối ưu quota) =====
                // ưu tiên email từ token
                email = TryGetClaimString("email", out var em) ? em : "";
                emailVerified = emailVerifiedFromToken;

                // name: token thường không có -> để rỗng, user cập nhật qua PUT /api/User/me
                var name = TryGetClaimString("name", out var nm) ? nm : "";

                // Chỉ khi email bị thiếu mới gọi Firebase Admin
                if (string.IsNullOrWhiteSpace(email))
                {
                    var userRecord = await _firebaseService.GetUserAsync(uid);
                    email = userRecord.Email ?? "";
                    if (string.IsNullOrWhiteSpace(name))
                        name = userRecord.DisplayName ?? "";
                    // fallback verified nếu token không có (hiếm)
                    if (!emailVerified)
                        emailVerified = userRecord.EmailVerified;
                }

                user = new User(
                    id: uid,
                    name: name,
                    email: email,
                    role: UserRole.Passenger,
                    createdAt: DateTime.UtcNow,
                    isEmailVerified: emailVerified,
                    cccd: null,
                    phone: null,
                    avatarURL: null
                );

                await _userRepository.AddAsync(user);
            }
            else
            {
                email = user.Email ?? "";

                // ưu tiên token, fallback DB
                emailVerified = emailVerifiedFromToken ? true : (user.IsEmailVerified ?? false);

                // ✅ sync 1 chiều: false -> true
                if (emailVerified && user.IsEmailVerified != true)
                {
                    var synced = new User(
                        id: user.Id,
                        name: user.Name,
                        email: user.Email,
                        role: user.Role ?? UserRole.Passenger,
                        createdAt: user.CreatedAt,
                        isEmailVerified: true,
                        cccd: user.CCCD,
                        phone: user.Phone,
                        avatarURL: user.AvatarURL
                    );

                    await _userRepository.UpdateAsync(uid, synced);
                    user = synced;
                }
            }

            var roleLower = (user.Role ?? UserRole.Passenger).ToString().ToLowerInvariant();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, uid),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, roleLower),
                new Claim("email_verified", emailVerified ? "true" : "false"),
            };

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
    }
}
