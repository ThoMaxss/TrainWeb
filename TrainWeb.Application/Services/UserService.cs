using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Services
{
    public class UserService
    {
        private readonly IUserRepository UserRepository;

        public UserService(IUserRepository userRepository)
        {
            UserRepository = userRepository;
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            var user = await UserRepository.GetByIdAsync(id);
            return user?.ToDomain();
        }

        public async Task<User?> CreateUserAsync(User user)
        {
            var userEntity = UserEntity.FromDomain(user);
            await UserRepository.AddAsync(userEntity);
            return userEntity.ToDomain();
        }

        public async Task<User?> UpdateUserAsync(string id, User user)
        {
            var userEntity = UserEntity.FromDomain(user);
            await UserRepository.UpdateAsync(id, userEntity);
            return userEntity.ToDomain();
        }

        public async Task DeleteUserAsync(string id)
        {
            await UserRepository.DeleteAsync(id);
        }
    }
}

