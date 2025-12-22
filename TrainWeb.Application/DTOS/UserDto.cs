using System;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public sealed class UserDto
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public UserRole? Role { get; set; }
        public DateTime? CreatedAt { get; set; }

        public string? CCCD { get; set; }
        public string? Phone { get; set; }
        public string? AvatarURL { get; set; }

        public bool? IsEmailVerified { get; set; }
    }
}
