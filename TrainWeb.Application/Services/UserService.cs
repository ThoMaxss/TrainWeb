using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;

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

        public async Task<User?> UpdateUserAsync(string id, User user)
        {
            await _userRepository.UpdateAsync(id, user);
            return user;
        }

        public Task DeleteUserAsync(string id)
            => _userRepository.DeleteAsync(id);
    }
}
