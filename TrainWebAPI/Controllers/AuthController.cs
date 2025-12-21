using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;
using TrainWeb.Infrastructure.Services;

namespace TrainWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly FirebaseService _firebaseService;

        public AuthController(
            IUserRepository userRepository,
            FirebaseService firebaseService)
        {
            _userRepository = userRepository;
            _firebaseService = firebaseService;
        }

        // Register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                    return BadRequest(new { error = "Email và mật khẩu không được để trống." });

                if (request.Password.Length < 6)
                    return BadRequest(new { error = "Mật khẩu phải có ít nhất 6 ký tự." });

                var existingUser = await _userRepository.GetByEmailAsync(request.Email);
                if (existingUser != null)
                    return BadRequest(new { error = "Email đã tồn tại." });

                var firebaseUserId = await _firebaseService.CreateUserAsync(request.Email, request.Password);
                if (string.IsNullOrEmpty(firebaseUserId))
                    return BadRequest(new { error = "Không thể tạo tài khoản. Vui lòng thử lại." });

                var user = new User(
                    id: firebaseUserId,
                    name: request.Name,
                    email: request.Email,
                    role: request.Role,
                    createdAt: DateTime.UtcNow,
                    isEmailVerified: null
                );

                await _userRepository.AddAsync(user);

                return Ok(new
                {
                    message = "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
                    userId = firebaseUserId,
                    email = request.Email,
                    role = request.Role.ToString()
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau." });
            }
        }

        // Login 
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.IdToken))
                    return BadRequest(new { error = "Thiếu idToken." });

                // Verify token & lấy thông tin từ Firebase
                var decoded = await _firebaseService.VerifyIdTokenAsync(request.IdToken);
                if (decoded == null)
                    return Unauthorized(new { error = "Token không hợp lệ." });

                var uid = decoded.Uid;

                var userRecord = await _firebaseService.GetUserAsync(uid);
                var email = userRecord.Email;
                var emailVerified = userRecord.EmailVerified;

                // Lấy profile từ Firestore
                var user = await _userRepository.GetByIdAsync(uid);
                if (user == null && !string.IsNullOrWhiteSpace(email))
                {
                    user = await _userRepository.GetByEmailAsync(email);
                }

                if (user == null)
                    return NotFound(new { error = "Không tìm thấy profile người dùng trong Firestore." });


                return Ok(new
                {
                    message = "Đăng nhập thành công",
                    userId = user.Id,
                    email = user.Email,
                    name = user.Name,
                    role = user.Role?.ToString(),
                    emailVerified = emailVerified
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau." });
            }
        }
    }

    // DTOs
    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.Passenger;
    }

    public class LoginRequest
    {
        public string IdToken { get; set; } = string.Empty;
    }

    public class VerifyEmailRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResendVerificationRequest
    {
        public string Email { get; set; } = string.Empty;
    }
}
