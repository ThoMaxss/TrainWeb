using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.Interfaces;
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

        public AuthController(
            IUserRepository userRepository,
            AuthService authService,
            BCryptPasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _authService = authService;
            _passwordHasher = passwordHasher;
        }

        //Register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("Email và mật khẩu không được để trống.");

            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
                return BadRequest("Email đã tồn tại.");

            var hashedPassword = _passwordHasher.HashPassword(request.Password);
   
            var newUser = new UserEntity
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name,
                Email = request.Email,
                PasswordHash = hashedPassword,
                Role = request.Role,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(newUser);

            return Ok(new
            {
                message = "Đăng ký thành công!",
                email = newUser.Email,
                role = newUser.Role.ToString()
            });
        }

        //Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest("Email và mật khẩu không được để trống.");

            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
                return Unauthorized("Sai email hoặc mật khẩu!");

            bool isValid = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
            if (!isValid)
                return Unauthorized("Sai email hoặc mật khẩu!");

            var token = _authService.GenerateJwtToken(user);

            return Ok(new
            {
                message = "Đăng nhập thành công",
                token,
                role = user.Role.ToString()
            });
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
}
