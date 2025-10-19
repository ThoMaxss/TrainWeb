using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Services;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] string email)
        {
            var user = await _authService.LoginAsync(email);
            if (user == null) return Unauthorized("Invalid credentials");
            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserEntity user)
        {
            await _authService.RegisterAsync(user);
            return Ok("User registered successfully");
        }

        [HttpGet("check-role")]
        public async Task<IActionResult> CheckRole(string userId, string role)
        {
            var hasRole = await _authService.CheckRoleAsync(userId, role);
            return Ok(new { UserId = userId, Role = role, HasRole = hasRole });
        }
    }
}
