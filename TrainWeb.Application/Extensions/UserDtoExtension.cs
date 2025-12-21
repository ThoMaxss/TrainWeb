using TrainWeb.Application.DTOS;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Application.Extensions
{
    public static class UserDtoExtension
    {
        public static UserDto ToDto(this User user) => new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };

        public static User FromDto(this UserDto dto) => new User(
            dto.Id,
            dto.Name,
            dto.Email,
            dto.Role,
            dto.CreatedAt ?? DateTime.UtcNow
        );
    }
}
