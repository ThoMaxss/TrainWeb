using Google.Cloud.Firestore;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;

namespace TrainWeb.Infrastructure.Persistence
{
    public class UserRepository(FirestoreDbContext context) : IUserRepository
    {
        private readonly FirestoreDb _db = context.Db ?? throw new ArgumentNullException(nameof(context.Db));
        private const string CollectionName = "Users";

        public Task<User?> GetByIdAsync(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            Query query = _db.Collection(CollectionName).WhereEqualTo("Email", email);
            QuerySnapshot snapshot = await query.GetSnapshotAsync();
            return snapshot.Documents.FirstOrDefault()?.ConvertTo<User>();
        }

        public Task<IEnumerable<User>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task AddAsync(User user)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(string id, User user)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(string id)
        {
            throw new NotImplementedException();
        }
    }
}
