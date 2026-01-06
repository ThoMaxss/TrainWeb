using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using TrainWeb.Application.Extensions;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

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

        // ========= DTO cho self-update (user/staff/admin) =========
        public sealed class UpdateMeRequest
        {
            public string? Name { get; set; }
            public string? CCCD { get; set; }
            public string? Phone { get; set; }
            public string? AvatarURL { get; set; }
        }

        // ========= DTO cho admin create/update =========
        public sealed class AdminCreateUserRequest
        {
            public string Id { get; set; } = default!;
            public string Name { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Role { get; set; } = "passenger"; // passenger|staff|admin

            public string? CCCD { get; set; }
            public string? Phone { get; set; }
            public string? AvatarURL { get; set; }
        }

        public sealed class AdminUpdateUserRequest
        {
            public string? Name { get; set; }
            public string? Role { get; set; } // admin mới được đổi role

            public string? CCCD { get; set; }
            public string? Phone { get; set; }
            public string? AvatarURL { get; set; }
        }

        // ========= Helper =========
        private string? GetUid()
            => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        private bool IsAdmin()
            => (User.FindFirst(ClaimTypes.Role)?.Value ?? "")
                .Equals("admin", StringComparison.OrdinalIgnoreCase);

        private static bool IsValidCccd(string cccd)
            => Regex.IsMatch(cccd, @"^\d{15}$"); // CCCD 15 số

        private static bool IsValidPhone(string phone)
            => Regex.IsMatch(phone, @"^(0|\+84)\d{9}$"); // đơn giản

        // ========== ADMIN ONLY: GET /api/User ==========
        [Authorize(Policy = "StaffOrAdmin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await UserService.GetAllAsync();
            return Ok(list.Select(x => x.ToDto()));
        }

        // ========== (SELF) GET /api/User/me ==========
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var uid = GetUid();
            if (string.IsNullOrWhiteSpace(uid))
                return Unauthorized(new { error = "Missing uid claim" });

            var user = await UserService.GetUserByIdAsync(uid);
            
            // Auto-create user if not exists (Sync Firebase -> Firestore)
            if (user == null)
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                var name = User.FindFirst(ClaimTypes.Name)?.Value ?? "New User";
                
                user = new User(
                    id: uid,
                    name: name,
                    email: email,
                    role: UserRole.Passenger,
                    createdAt: DateTime.UtcNow,
                    isEmailVerified: false
                );
                
                await UserService.CreateUserAsync(user);
            }

            return Ok(user.ToDto());
        }

        // ========== (SELF) PUT /api/User/me ==========
        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateMeRequest req)
        {
            var uid = GetUid();
            if (string.IsNullOrWhiteSpace(uid))
                return Unauthorized(new { error = "Missing uid claim" });

            if (!string.IsNullOrWhiteSpace(req.CCCD) && !IsValidCccd(req.CCCD))
                return BadRequest(new { error = "CCCD must be 15 digits" });

            if (!string.IsNullOrWhiteSpace(req.Phone) && !IsValidPhone(req.Phone))
                return BadRequest(new { error = "Phone is invalid" });

            // ✅ gọi service chuẩn hoá (không tự new User ở controller nữa)
            var updated = await UserService.UpdateMeAsync(
                uid,
                name: req.Name,
                cccd: req.CCCD,
                phone: req.Phone,
                avatarUrl: req.AvatarURL
            );

            if (updated == null) return NotFound("User Not Found");
            return Ok(updated.ToDto());
        }

        // ========== GET /api/User/{id} ==========
        // Admin xem được tất cả, còn user/staff chỉ xem được chính mình
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] string id)
        {
            var uid = GetUid();
            if (string.IsNullOrWhiteSpace(uid))
                return Unauthorized(new { error = "Missing uid claim" });

            if (!IsAdmin() && id != uid)
                return Forbid();

            var user = await UserService.GetUserByIdAsync(id);
            if (user == null) return NotFound("User Not Found");

            return Ok(user.ToDto());
        }

        // ========== ADMIN ONLY: POST /api/User ==========
        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] AdminCreateUserRequest req)
        {
            var roleLower = (req.Role ?? "passenger").ToLowerInvariant();
            if (roleLower is not ("passenger" or "staff" or "admin"))
                return BadRequest(new { error = "Invalid role" });

            if (!string.IsNullOrWhiteSpace(req.CCCD) && !IsValidCccd(req.CCCD))
                return BadRequest(new { error = "CCCD must be 15 digits" });

            if (!string.IsNullOrWhiteSpace(req.Phone) && !IsValidPhone(req.Phone))
                return BadRequest(new { error = "Phone is invalid" });

            var roleEnum = roleLower switch
            {
                "admin" => UserRole.Admin,
                "staff" => UserRole.Staff,
                _ => UserRole.Passenger
            };

            var user = new User(
                id: req.Id,
                name: req.Name ?? "",
                email: req.Email ?? "",
                role: roleEnum,
                createdAt: DateTime.UtcNow,
                isEmailVerified: false,
                cccd: req.CCCD,
                phone: req.Phone,
                avatarURL: req.AvatarURL
            );

            var created = await UserService.CreateUserAsync(user);
            return Ok(created?.ToDto());
        }

        // ========== ADMIN ONLY: PUT /api/User/{id} ==========
        [Authorize(Policy = "AdminOnly")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser([FromRoute] string id, [FromBody] AdminUpdateUserRequest req)
        {
            if (!string.IsNullOrWhiteSpace(req.CCCD) && !IsValidCccd(req.CCCD))
                return BadRequest(new { error = "CCCD must be 15 digits" });

            if (!string.IsNullOrWhiteSpace(req.Phone) && !IsValidPhone(req.Phone))
                return BadRequest(new { error = "Phone is invalid" });

            // parse role (admin truyền lên dạng string)
            UserRole? roleToSet = null;
            if (!string.IsNullOrWhiteSpace(req.Role))
            {
                var roleLower = req.Role.ToLowerInvariant();
                if (roleLower is not ("passenger" or "staff" or "admin"))
                    return BadRequest(new { error = "Invalid role" });

                roleToSet = roleLower switch
                {
                    "admin" => UserRole.Admin,
                    "staff" => UserRole.Staff,
                    _ => UserRole.Passenger
                };
            }

            var updated = await UserService.AdminUpdateAsync(
                id,
                name: req.Name,
                cccd: req.CCCD,
                phone: req.Phone,
                avatarUrl: req.AvatarURL,
                role: roleToSet
            );

            if (updated == null) return NotFound("User Not Found");
            return Ok(updated.ToDto());
        }

        // ========== ADMIN ONLY: DELETE /api/User/{id} ==========
        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] string id)
        {
            var myUid = GetUid();
            if (!string.IsNullOrWhiteSpace(myUid) && myUid == id)
                return BadRequest(new { error = "Cannot delete yourself" });

            await UserService.DeleteUserAsync(id);
            return NoContent();
        }
    }
}
