using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;
using TrainWeb.Infrastructure.Services;

public class FirebaseAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly FirebaseService _firebaseService;

    public FirebaseAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        FirebaseService firebaseService)
        : base(options, logger, encoder, clock)
    {
        _firebaseService = firebaseService;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var authHeader = Request.Headers.Authorization.ToString();
        if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
            return AuthenticateResult.NoResult();

        var idToken = authHeader["Bearer ".Length..].Trim();
        var decoded = await _firebaseService.VerifyIdTokenAsync(idToken);
        if (decoded == null)
            return AuthenticateResult.Fail("Invalid Firebase token");

        var userRecord = await _firebaseService.GetUserAsync(decoded.Uid);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, decoded.Uid),
            new Claim(ClaimTypes.Email, userRecord.Email ?? "")
        };

        claims.Add(new Claim("email_verified", userRecord.EmailVerified.ToString().ToLower()));

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
}
