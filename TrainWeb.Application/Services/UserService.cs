using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public Task<User?> GetUserByIdAsync(string id)
            => _userRepository.GetByIdAsync(id);

        public async Task<User?> CreateUserAsync(User user)
        {
            await _userRepository.AddAsync(user);
            return user;
        }

        public async Task<User?> UpdateMeAsync(string uid, string? name, string? cccd, string? phone, string? avatarUrl)
        {
            var current = await _userRepository.GetByIdAsync(uid);
            if (current == null) return null;

            var updated = new User(
                id: current.Id,
                name: string.IsNullOrWhiteSpace(name) ? current.Name : name,
                email: current.Email,
                role: current.Role ?? UserRole.Passenger,                 // ✅ fallback
                createdAt: current.CreatedAt,
                isEmailVerified: current.IsEmailVerified,
                cccd: string.IsNullOrWhiteSpace(cccd) ? current.CCCD : cccd,
                phone: string.IsNullOrWhiteSpace(phone) ? current.Phone : phone,
                avatarURL: string.IsNullOrWhiteSpace(avatarUrl) ? current.AvatarURL : avatarUrl
            );

            await _userRepository.UpdateAsync(uid, updated);
            return updated;
        }

        public async Task<User?> AdminUpdateAsync(string id, string? name, string? cccd, string? phone, string? avatarUrl, UserRole? role)
        {
            var current = await _userRepository.GetByIdAsync(id);
            if (current == null) return null;

            var updated = new User(
                id: current.Id,
                name: string.IsNullOrWhiteSpace(name) ? current.Name : name,
                email: current.Email,
                role: role ?? current.Role ?? UserRole.Passenger,         
                createdAt: current.CreatedAt,
                isEmailVerified: current.IsEmailVerified,
                cccd: string.IsNullOrWhiteSpace(cccd) ? current.CCCD : cccd,
                phone: string.IsNullOrWhiteSpace(phone) ? current.Phone : phone,
                avatarURL: string.IsNullOrWhiteSpace(avatarUrl) ? current.AvatarURL : avatarUrl
            );

            await _userRepository.UpdateAsync(id, updated);
            return updated;
        }

        public Task DeleteUserAsync(string id)
            => _userRepository.DeleteAsync(id);
    }
}
