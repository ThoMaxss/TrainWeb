using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Entities;

namespace TrainWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            await _userService.CreateUserAsync(user);
            return Ok("User created successfully");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] User user)
        {
            await _userService.UpdateUserAsync(id, user);
            return Ok("User updated successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            await _userService.DeleteUserAsync(id);
            return Ok("User deleted successfully");
        }
    }
}
