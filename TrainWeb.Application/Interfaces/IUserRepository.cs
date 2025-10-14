using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Application.Interfaces
{
    public interface IUserRepository : IRepository<UserEntity>
    {
        Task<UserEntity?> GetByIdAsync(string id);
        Task<UserEntity?> GetByEmailAsync(string email);
        Task<IEnumerable<UserEntity>> GetAllAsync();
        Task AddAsync(UserEntity user);
        Task UpdateAsync(string id, UserEntity user);
        Task DeleteAsync(string id);
    }
}
