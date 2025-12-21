using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public class UserRepository : FirestoreRepository<UserEntity>, IUserRepository
    {
        private const string CollectionName = "users";

        public UserRepository(FirestoreDbContext context) : base(context) { }

        public async Task<User?> GetByIdAsync(string id)
        {
            var entity = await GetByIdAsync(CollectionName, id);
            return entity?.ToDomain();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            var entity = await QueryFirstAsync(CollectionName, c =>
                c.WhereEqualTo("email", email)
            );

            return entity?.ToDomain();
        }

        public async Task<IReadOnlyList<User>> GetAllAsync()
        {
            var entities = await GetAllAsync(CollectionName);
            return entities.Select(x => x.ToDomain()).ToList();
        }

        public async Task AddAsync(User user)
        {
            var entity = UserEntity.FromDomain(user);
            await AddAsync(CollectionName, entity.Id, entity);
        }

        public async Task UpdateAsync(string id, User user)
        {
            var entity = UserEntity.FromDomain(user);
            entity.Id = id;
            await UpdateAsync(CollectionName, id, entity);
        }

        public Task DeleteAsync(string id)
            => base.DeleteAsync(CollectionName, id);
    }
}
