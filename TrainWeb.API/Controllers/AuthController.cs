using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.DTOs;
using TrainWeb.Application.Services;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// User login endpoint
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] AuthRequest request)
        {
            _logger.LogInformation("Login attempt for email: {Email}", request.Email);
            var result = await _authService.Login(request);
            if (!result.Success)
                return Unauthorized(result);
            return Ok(result);
        }

        /// <summary>
        /// User registration endpoint
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            _logger.LogInformation("Registration attempt for email: {Email}", request.Email);
            var result = await _authService.Register(request);
            if (!result.Success)
                return BadRequest(result);
            return Ok(result);
        }

        /// <summary>
        /// Validate token endpoint
        /// </summary>
        [HttpPost("validate")]
        public async Task<ActionResult<object>> ValidateToken([FromBody] dynamic request)
        {
            var token = request.token;
            var isValid = await _authService.ValidateToken(token);
            return Ok(new { valid = isValid });
        }
    }
}
