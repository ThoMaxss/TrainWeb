using System;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Domain
{
    public sealed class User
    {
        public string? Id { get; }
        public string? Name { get; }
        public string? Email { get; }
        public UserRole? Role { get; }
        public DateTime? CreatedAt { get; }
        public bool? IsEmailVerified { get; }

        public string? CCCD { get; }
        public string? Phone { get; }
        public string? AvatarURL { get; }

        public User(
            string? id,
            string? name,
            string? email,
            UserRole? role,
            DateTime? createdAt,
            bool? isEmailVerified = false,
            string? cccd = null,
            string? phone = null,
            string? avatarURL = null)
        {
            Id = id;
            Name = name;
            Email = email;
            Role = role;
            CreatedAt = createdAt;
            IsEmailVerified = isEmailVerified;

            CCCD = cccd;
            Phone = phone;
            AvatarURL = avatarURL;
        }
    }
}
