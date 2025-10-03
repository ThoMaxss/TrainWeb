using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Extensions;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Entities;

namespace TrainWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private UserService UserService { get; }

        public UserController(UserService userService)
        {
            UserService = userService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] string id)
        {
            var user = await UserService.GetUserByIdAsync(id);
            if (user == null) return NotFound("User Not Found");
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserDto userDto)
        {
            var createdUser = await UserService.CreateUserAsync(userDto.FromDto());
            return Ok(createdUser?.ToDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser([FromRoute] string id, [FromBody] UserDto userDto)
        {
            var user = await UserService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound("User Not Found");
            }
            userDto.Id = user.Id;
            var updatedUser = await UserService.UpdateUserAsync(id, userDto.FromDto());
            return Ok(updatedUser);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            await UserService.DeleteUserAsync(id);
            return Ok();
        }
    }
}
