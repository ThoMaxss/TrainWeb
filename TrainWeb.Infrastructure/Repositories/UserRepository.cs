using Google.Cloud.Firestore;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public class UserRepository : FirestoreRepository<UserEntity>, IUserRepository
    {
        private const string CollectionName = "Users";

        public UserRepository(FirestoreDbContext context) : base(context) { }

        public async Task<UserEntity?> GetByIdAsync(string id)
        {
            return await GetByIdAsync(CollectionName, id);
        }

        public async Task<UserEntity?> GetByEmailAsync(string email)
        {
            return await QueryFirstAsync(CollectionName, collection =>
                collection.WhereEqualTo("Email", email)
            );
        }

        public async Task<IEnumerable<UserEntity>> GetAllAsync()
        {
            return await GetAllAsync(CollectionName);
        }

        public async Task AddAsync(UserEntity userEntity)
        {
            await AddAsync(CollectionName, userEntity.Id, userEntity);
        }

        public async Task UpdateAsync(string id, UserEntity user)
        {
            await UpdateAsync(CollectionName, id, user);
        }

        public async Task UpdateAsync(UserEntity user)
        {
            await UpdateAsync(CollectionName, user.Id, user);
        }

        public async Task UpdateEmailVerifiedStatusAsync(string id, bool isVerified)
        {
            await UpdateFieldsAsync(CollectionName, id, new Dictionary<string, object>
            {
                { "IsEmailVerified", isVerified }
            });
        }

        public async Task DeleteAsync(string id)
        {
            await base.DeleteAsync(CollectionName, id);
        }
    }
}