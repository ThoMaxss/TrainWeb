using Google.Cloud.Firestore;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Infrastructure.Repositories
{
    public class UserRepository : FirestoreRepository<UserEntity>, IUserRepository
    {
        public UserRepository(FirestoreDbContext context) : base(context) { }
        private const string CollectionName = "Users";

        public async Task<UserEntity?> GetByIdAsync(string id)
        {
            return await GetByIdAsync(CollectionName, id);
        }

        public async Task<UserEntity?> GetByEmailAsync(string email)
        {
            Query query = FirestoreDb.Collection(CollectionName).WhereEqualTo("Email", email);
            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            return snapshot.Documents.FirstOrDefault()?.ConvertTo<UserEntity>();
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
        public async Task DeleteAsync(string id)
        {
            await base.DeleteAsync(CollectionName, id);
        }

    }
}
