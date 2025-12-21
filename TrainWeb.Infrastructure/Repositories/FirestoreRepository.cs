using Google.Cloud.Firestore;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public abstract class FirestoreRepository<T> : IRepository<T> where T : class
    {
        public FirestoreDb FirestoreDb { get; }

        public FirestoreRepository(FirestoreDbContext context)
        {
            if (context.Db == null)
                throw new ArgumentNullException(nameof(context.Db), "FirestoreDbContext.Db cannot be null.");

            FirestoreDb = context.Db;
        }

        public async Task<T?> GetByIdAsync(string collection, string id)
        {
            var docRef = FirestoreDb.Collection(collection).Document(id);
            var snapshot = await docRef.GetSnapshotAsync();
            return snapshot.Exists ? snapshot.ConvertTo<T>() : null;
        }

        public async Task<IEnumerable<T>> GetAllAsync(string collection)
        {
            var snapshot = await FirestoreDb.Collection(collection).GetSnapshotAsync();
            return snapshot.Documents.Select(doc => doc.ConvertTo<T>()).ToList();
        }

        public async Task AddAsync(string collection, string id, T entity)
        {
            await FirestoreDb.Collection(collection).Document(id).SetAsync(entity);
        }

        public async Task UpdateAsync(string collection, string id, T entity)
        {
            await FirestoreDb.Collection(collection).Document(id).SetAsync(entity, SetOptions.MergeAll);
        }

        public async Task DeleteAsync(string collection, string id)
        {
            await FirestoreDb.Collection(collection).Document(id).DeleteAsync();
        }

        public async Task UpdateFieldsAsync(string collection, string id, Dictionary<string, object> fields)
        {
            var docRef = FirestoreDb.Collection(collection).Document(id);
            await docRef.UpdateAsync(fields);
        }

        public async Task<bool> ExistsAsync(string collection, string id)
        {
            var docRef = FirestoreDb.Collection(collection).Document(id);
            var snapshot = await docRef.GetSnapshotAsync();
            return snapshot.Exists;
        }

        protected async Task<IEnumerable<T>> QueryAsync(string collection, Func<CollectionReference, Query> queryBuilder)
        {
            var collectionRef = FirestoreDb.Collection(collection);
            var query = queryBuilder(collectionRef);
            var snapshot = await query.GetSnapshotAsync();
            return snapshot.Documents.Select(doc => doc.ConvertTo<T>()).ToList();
        }

        protected async Task<T?> QueryFirstAsync(string collection, Func<CollectionReference, Query> queryBuilder)
        {
            var collectionRef = FirestoreDb.Collection(collection);
            var query = queryBuilder(collectionRef).Limit(1);
            var snapshot = await query.GetSnapshotAsync();
            return snapshot.Documents.FirstOrDefault()?.ConvertTo<T>();
        }
    }
}