using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.Interfaces;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enum;
using TrainWeb.Infrastructure.Services;

namespace TrainWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly AuthService _authService;
        private readonly BCryptPasswordHasher _passwordHasher;
        private readonly FirebaseService _firebaseService;

        public AuthController(
           IUserRepository userRepository,
           AuthService authService,
           BCryptPasswordHasher passwordHasher,
           FirebaseService firebaseService)
        {
            _userRepository = userRepository;
            _authService = authService;
            _passwordHasher = passwordHasher;
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
                {
                    return BadRequest(new { error = "Không thể tạo tài khoản Firebase. Vui lòng thử lại." });
                }

                var hashedPassword = _passwordHasher.HashPassword(request.Password);

                var newUser = new UserEntity
                {
                    Id = firebaseUserId, 
                    Name = request.Name,
                    Email = request.Email,
                    PasswordHash = hashedPassword,
                    Role = request.Role,
                    CreatedAt = DateTime.UtcNow,
                    IsEmailVerified = false
                };

                await _userRepository.AddAsync(newUser);

                // 5. Gửi email xác thực qua Firebase
                await _firebaseService.SendEmailVerificationAsync(request.Email);

                return Ok(new
                {
                    message = "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
                    userId = newUser.Id,
                    email = newUser.Email,
                    role = newUser.Role.ToString(),
                    emailVerified = false
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
                // 1. Validate input
                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                    return BadRequest(new { error = "Email và mật khẩu không được để trống." });

                // 2. Lấy user từ database
                var user = await _userRepository.GetByEmailAsync(request.Email);
                if (user == null)
                    return Unauthorized(new { error = "Sai email hoặc mật khẩu!" });

                // 3. Verify password
                bool isValid = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
                if (!isValid)
                    return Unauthorized(new { error = "Sai email hoặc mật khẩu!" });

                // 4. 🔴 THÊM: Kiểm tra email đã xác thực chưa (optional)
                // Bỏ comment dòng dưới nếu bạn muốn bắt buộc xác thực email trước khi đăng nhập
                /*
                if (!user.IsEmailVerified)
                {
                    return Unauthorized(new { 
                        error = "Vui lòng xác thực email trước khi đăng nhập.",
                        emailVerified = false
                    });
                }
                */

                // 5. Generate JWT token
                var token = _authService.GenerateJwtToken(user);

                return Ok(new
                {
                    message = "Đăng nhập thành công",
                    token,
                    userId = user.Id,
                    email = user.Email,
                    name = user.Name,
                    role = user.Role.ToString(),
                    emailVerified = user.IsEmailVerified
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                // Log exception
                return StatusCode(500, new { error = "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau." });
            }
        }

        // 🔴 THÊM: Endpoint để verify email callback từ Firebase
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
        {
            try
            {
                // 1. Verify email trong Firebase
                var isVerified = await _firebaseService.VerifyEmailAsync(request.Email);
                if (!isVerified)
                {
                    return BadRequest(new { error = "Không thể xác thực email." });
                }

                // 2. Lấy user từ database
                var user = await _userRepository.GetByEmailAsync(request.Email);
                if (user == null)
                {
                    return NotFound(new { error = "Không tìm thấy người dùng." });
                }

                // 3. Cập nhật trạng thái
                user.IsEmailVerified = true;

                // 4. Save vào database - DÙNG OVERLOAD MỚI
                await _userRepository.UpdateAsync(user); // ✅ Đơn giản hơn

                return Ok(new { message = "Email đã được xác thực thành công!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { error = "Đã xảy ra lỗi." });
            }
        }

        // 🔴 THÊM: Endpoint để gửi lại email xác thực
        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerification([FromBody] ResendVerificationRequest request)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(request.Email);
                if (user == null)
                {
                    return NotFound(new { error = "Không tìm thấy người dùng." });
                }

                if (user.IsEmailVerified)
                {
                    return BadRequest(new { error = "Email đã được xác thực." });
                }

                await _firebaseService.SendEmailVerificationAsync(request.Email);

                return Ok(new { message = "Email xác thực đã được gửi lại." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { error = "Đã xảy ra lỗi." });
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
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
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