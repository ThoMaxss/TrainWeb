using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces; 
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Infrastructure.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserEntity?> LoginAsync(string email)
        {
            var users = await _userRepository.GetAllAsync();
            return users.FirstOrDefault(u => u.Email == email);
        }

        public async Task RegisterAsync(UserEntity user)
        {
            await _userRepository.AddAsync(user);
        }

        public async Task<bool> CheckRoleAsync(string userId, string role)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            if (Enum.TryParse<UserRole>(role, true, out var parsedRole))
            {
                return user.Role == parsedRole;
            }
            return false;

        }
    }
}
