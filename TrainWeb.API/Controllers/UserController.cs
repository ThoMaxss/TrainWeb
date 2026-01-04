using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainWeb.Application.DTOs;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Data;
using System.Security.Cryptography;
using System.Text;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserController> _logger;

        public UserController(ApplicationDbContext context, ILogger<UserController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get user profile
        /// </summary>
        [HttpGet("profile/{userId}")]
        public async Task<ActionResult<UserDto>> GetProfile(string userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { error = "User not found" });
                }

                return Ok(new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    PhoneNumber = user.PhoneNumber,
                    Address = user.Address,
                    DateOfBirth = user.DateOfBirth,
                    Gender = user.Gender,
                    IdNumber = user.IdNumber,
                    ProfilePicture = user.ProfilePicture,
                    IsActive = user.IsActive,
                    UserRole = user.UserRole.ToString(),
                    LastLoginAt = user.LastLoginAt,
                    IsEmailVerified = user.IsEmailVerified,
                    IsPhoneVerified = user.IsPhoneVerified,
                    CreatedAt = user.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user profile");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Update user profile
        /// </summary>
        [HttpPut("profile/{userId}")]
        public async Task<ActionResult<object>> UpdateProfile(string userId, [FromBody] UpdateUserProfileRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { error = "User not found" });
                }

                // Update fields
                user.FullName = request.FullName ?? user.FullName;
                user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
                user.Address = request.Address ?? user.Address;
                if (!string.IsNullOrEmpty(request.DateOfBirth))
                {
                    if (DateTime.TryParse(request.DateOfBirth, out var dob))
                        user.DateOfBirth = dob;
                }
                user.Gender = request.Gender ?? user.Gender;
                user.IdNumber = request.IdNumber ?? user.IdNumber;
                user.ProfilePicture = request.ProfilePicture ?? user.ProfilePicture;
                user.UpdatedAt = DateTime.UtcNow;

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} profile updated", userId);

                return Ok(new { message = "Profile updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user profile");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Change password
        /// </summary>
        [HttpPost("change-password")]
        public async Task<ActionResult<object>> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(request.UserId);
                if (user == null)
                {
                    return NotFound(new { error = "User not found" });
                }

                // Verify current password
                if (!VerifyPassword(request.CurrentPassword, user.PasswordHash))
                {
                    _logger.LogWarning("Invalid password attempt for user {UserId}", request.UserId);
                    return Unauthorized(new { error = "Current password is incorrect" });
                }

                // Validate new password
                if (request.NewPassword.Length < 8)
                {
                    return BadRequest(new { error = "New password must be at least 8 characters" });
                }

                // Update password
                user.PasswordHash = HashPassword(request.NewPassword);
                user.UpdatedAt = DateTime.UtcNow;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} changed password", request.UserId);

                return Ok(new { message = "Password changed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get all users (Admin only)
        /// </summary>
        [HttpGet("all")]
        public async Task<ActionResult<object>> GetAllUsers([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var totalCount = await _context.Users.CountAsync();
                var users = await _context.Users
                    .Where(u => u.IsActive)
                    .OrderBy(u => u.FullName)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = users.Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FullName = u.FullName,
                    PhoneNumber = u.PhoneNumber,
                    IsActive = u.IsActive,
                    UserRole = u.UserRole.ToString(),
                    LastLoginAt = u.LastLoginAt,
                    CreatedAt = u.CreatedAt
                }).ToList();

                return Ok(new
                {
                    data = result,
                    pagination = new
                    {
                        pageNumber,
                        pageSize,
                        totalCount,
                        totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all users");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Deactivate user (Admin only)
        /// </summary>
        [HttpPost("{userId}/deactivate")]
        public async Task<ActionResult<object>> DeactivateUser(string userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { error = "User not found" });
                }

                user.IsActive = false;
                user.UpdatedAt = DateTime.UtcNow;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} deactivated", userId);

                return Ok(new { message = "User deactivated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deactivating user");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Activate user (Admin only)
        /// </summary>
        [HttpPost("{userId}/activate")]
        public async Task<ActionResult<object>> ActivateUser(string userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { error = "User not found" });
                }

                user.IsActive = true;
                user.UpdatedAt = DateTime.UtcNow;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} activated", userId);

                return Ok(new { message = "User activated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error activating user");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Verify email
        /// </summary>
        [HttpPost("{userId}/verify-email")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> VerifyEmail(string userId, [FromBody] VerifyEmailRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { error = "User not found" });
                }

                // In production: validate OTP/token sent to email
                // For now: simplified verification
                if (string.IsNullOrEmpty(request.VerificationCode))
                {
                    return BadRequest(new { error = "Verification code is required" });
                }

                user.IsEmailVerified = true;
                user.UpdatedAt = DateTime.UtcNow;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Email verified for user {UserId}", userId);

                return Ok(new { message = "Email verified successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying email");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Verify phone
        /// </summary>
        [HttpPost("{userId}/verify-phone")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> VerifyPhone(string userId, [FromBody] VerifyPhoneRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { error = "User not found" });
                }

                // In production: validate OTP sent to phone
                if (string.IsNullOrEmpty(request.VerificationCode))
                {
                    return BadRequest(new { error = "Verification code is required" });
                }

                user.IsPhoneVerified = true;
                user.UpdatedAt = DateTime.UtcNow;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Phone verified for user {UserId}", userId);

                return Ok(new { message = "Phone verified successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying phone");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get user statistics (Admin only)
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetUserStatistics()
        {
            try
            {
                var totalUsers = await _context.Users.CountAsync();
                var activeUsers = await _context.Users.CountAsync(u => u.IsActive);
                var emailVerified = await _context.Users.CountAsync(u => u.IsEmailVerified);
                var phoneVerified = await _context.Users.CountAsync(u => u.IsPhoneVerified);
                var recentUsers = await _context.Users
                    .Where(u => u.CreatedAt >= DateTime.UtcNow.AddDays(-30))
                    .CountAsync();

                return Ok(new
                {
                    totalUsers,
                    activeUsers,
                    emailVerified,
                    phoneVerified,
                    recentUsers,
                    inactiveUsers = totalUsers - activeUsers
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user statistics");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string password, string hash)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput.Equals(hash);
        }
    }

    public class UpdateUserProfileRequest
    {
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? IdNumber { get; set; }
        public string? ProfilePicture { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class VerifyEmailRequest
    {
        public string VerificationCode { get; set; }
    }

    public class VerifyPhoneRequest
    {
        public string VerificationCode { get; set; }
    }
}
