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
            CreatedAt = user.CreatedAt,

            CCCD = user.CCCD,
            Phone = user.Phone,
            AvatarURL = user.AvatarURL,
            IsEmailVerified = user.IsEmailVerified
        };
    }
}
