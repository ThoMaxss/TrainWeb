using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.Extensions
{
    public static class UserUpdateExtension
    {
        public static User WithProfile(
            this User current,
            string? name = null,
            string? cccd = null,
            string? phone = null,
            string? avatarUrl = null)
        {
            return new User(
                id: current.Id,
                name: name ?? current.Name,
                email: current.Email,
                role: current.Role ?? UserRole.Passenger,
                createdAt: current.CreatedAt,
                isEmailVerified: current.IsEmailVerified ?? false,
                cccd: cccd ?? current.CCCD,
                phone: phone ?? current.Phone,
                avatarURL: avatarUrl ?? current.AvatarURL
            );
        }

        public static User WithRole(this User current, UserRole role)
        {
            return new User(
                id: current.Id,
                name: current.Name,
                email: current.Email,
                role: role,
                createdAt: current.CreatedAt,
                isEmailVerified: current.IsEmailVerified ?? false,
                cccd: current.CCCD,
                phone: current.Phone,
                avatarURL: current.AvatarURL
            );
        }
    }
}
