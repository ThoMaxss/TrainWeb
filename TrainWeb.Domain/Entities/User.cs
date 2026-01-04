using System;
using TrainWeb.Domain.Enums;

namespace TrainWeb.Domain.Entities
{
    public class User
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PasswordHash { get; set; }
        public string PhoneNumber { get; set; }
        public string? Address { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; } // Male, Female, Other
        public string? IdNumber { get; set; } // ID card / passport number
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; }
        public UserRole UserRole { get; set; }
        public string? ProfilePicture { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public int? FailedLoginAttempts { get; set; }
        public bool IsEmailVerified { get; set; }
        public bool IsPhoneVerified { get; set; }

        public User()
        {
            Id = Guid.NewGuid().ToString();
            CreatedAt = DateTime.UtcNow;
            IsActive = true;
            IsEmailVerified = false;
            IsPhoneVerified = false;
            FailedLoginAttempts = 0;
        }
    }
}
