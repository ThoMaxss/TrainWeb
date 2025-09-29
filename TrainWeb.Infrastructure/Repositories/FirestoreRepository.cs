using Google.Cloud.Firestore;

namespace TrainWeb.Infrastructure.Repositories
{
    public class FirestoreRepository<T> : IRepository<T> where T : class
    {
        private readonly FirestoreDb _db;

        public FirestoreRepository(FirestoreDbContext context)
        {
            if (context.Db == null)
                throw new ArgumentNullException(nameof(context.Db), "FirestoreDbContext.Db cannot be null.");
            _db = context.Db;
        }

        public async Task<T?> GetByIdAsync(string collection, string id)
        {
            var docRef = _db.Collection(collection).Document(id);
            var snapshot = await docRef.GetSnapshotAsync();
            return snapshot.Exists ? snapshot.ConvertTo<T>() : null;
        }

        public async Task<IEnumerable<T>> GetAllAsync(string collection)
        {
            var snapshot = await _db.Collection(collection).GetSnapshotAsync();
            return snapshot.Documents.Select(doc => doc.ConvertTo<T>()).ToList();
        }

        public async Task AddAsync(string collection, string id, T entity)
        {
            await _db.Collection(collection).Document(id).SetAsync(entity);
        }

        public async Task UpdateAsync(string collection, string id, T entity)
        {
            await _db.Collection(collection).Document(id).SetAsync(entity, SetOptions.Overwrite);
        }

        public async Task DeleteAsync(string collection, string id)
        {
            await _db.Collection(collection).Document(id).DeleteAsync();
        }
    }
}
