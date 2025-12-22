using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;
using TrainWeb.Infrastructure.Services;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly FirebaseService _firebaseService;

        public AuthController(IUserRepository userRepository, FirebaseService firebaseService)
        {
            _userRepository = userRepository;
            _firebaseService = firebaseService;
        }

        // ========== DTO ==========
        public sealed class LoginRequest
        {
            public string IdToken { get; set; } = string.Empty;
        }

        public sealed class RegisterRequest
        {
            public string Name { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        // ========== (OPTIONAL) Register on BE ==========
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest("Email/Password is required");

            var uid = await _firebaseService.CreateUserAsync(req.Email, req.Password);
            if (string.IsNullOrWhiteSpace(uid))
                return BadRequest("Create Firebase user failed");

            var user = new User(
                id: uid,
                name: req.Name,
                email: req.Email,
                role: UserRole.Passenger,
                createdAt: DateTime.UtcNow,
                isEmailVerified: false
            );

            await _userRepository.AddAsync(user);

            return Ok(new
            {
                message = "Register success",
                uid,
                role = "passenger"
            });
        }

        // ========== (OPTIONAL) Login on BE ==========
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.IdToken))
                return BadRequest("idToken is required");

            var decoded = await _firebaseService.VerifyIdTokenAsync(req.IdToken);
            if (decoded == null) return Unauthorized("Invalid Firebase token");

            var user = await _userRepository.GetByIdAsync(decoded.Uid);
            if (user == null)
            {
                var record = await _firebaseService.GetUserAsync(decoded.Uid);
                user = new User(
                    id: decoded.Uid,
                    name: record.DisplayName ?? "",
                    email: record.Email ?? "",
                    role: UserRole.Passenger,
                    createdAt: DateTime.UtcNow,
                    isEmailVerified: record.EmailVerified
                );
                await _userRepository.AddAsync(user);
            }

            return Ok(new
            {
                message = "Login success",
                uid = decoded.Uid,
                email = user.Email,
                role = (user.Role ?? UserRole.Passenger).ToString().ToLowerInvariant()
            });
        }

        // ========== ME (quan trọng) ==========
        // ========== ME (quan trọng) ==========
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var uid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(uid))
                return Unauthorized(new { error = "Missing uid claim" });

            var role = (User.FindFirstValue(ClaimTypes.Role) ?? "passenger").ToLowerInvariant();

            var emailVerifiedStr = User.FindFirstValue("email_verified");
            var emailVerified = bool.TryParse(emailVerifiedStr, out var v) && v; // ✅ bool thật

            var email = User.FindFirstValue(ClaimTypes.Email) ?? "";

            var dbUser = await _userRepository.GetByIdAsync(uid);

            return Ok(new
            {
                uid,
                email = !string.IsNullOrWhiteSpace(email) ? email : (dbUser?.Email ?? ""),
                name = dbUser?.Name ?? "",
                role,
                createdAt = dbUser?.CreatedAt,  
                email_verified = emailVerified  
            });
        }

        // ========== Test phân quyền ==========
        [Authorize(Policy = "AdminOnly")]
        [HttpGet("admin-test")]
        public IActionResult AdminTest() => Ok("OK - ADMIN");

        [Authorize(Policy = "StaffOrAdmin")]
        [HttpGet("staff-test")]
        public IActionResult StaffTest()
        {
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "";
            if (role == "admin") return Ok("OK - ADMIN");
            if (role == "staff") return Ok("OK - STAFF");
            return Forbid();
        }
    }
}
