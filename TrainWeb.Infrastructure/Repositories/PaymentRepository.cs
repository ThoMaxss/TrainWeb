using Google.Cloud.Firestore;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public class PaymentRepository : FirestoreRepository<PaymentEntity>, IPaymentRepository
    {
        private const string CollectionName = "payments"; 

        public PaymentRepository(FirestoreDbContext context) : base(context) { }

        public Task<PaymentEntity?> GetByIdAsync(string id)
            => GetByIdAsync(CollectionName, id);

        public Task<IEnumerable<PaymentEntity>> GetAllAsync()
            => GetAllAsync(CollectionName);

        public async Task<IEnumerable<PaymentEntity>?> GetByBookingIdAsync(string bookingId)
        {
            var snapshot = await FirestoreDb.Collection(CollectionName)
                .WhereEqualTo("bookingId", bookingId)
                .GetSnapshotAsync();

            return snapshot.Documents.Select(d => d.ConvertTo<PaymentEntity>()).ToList();
        }

        public async Task<PaymentEntity?> GetPendingByBookingIdAsync(string bookingId)
        {
            var snapshot = await FirestoreDb.Collection(CollectionName)
                .WhereEqualTo("bookingId", bookingId)
                .WhereEqualTo("status", "pending") 
                .Limit(1)
                .GetSnapshotAsync();

            var doc = snapshot.Documents.FirstOrDefault();
            return doc == null ? null : doc.ConvertTo<PaymentEntity>();
        }

        public async Task<IEnumerable<PaymentEntity>?> GetByUserIdAsync(string userId)
        {
            var snapshot = await FirestoreDb.Collection(CollectionName)
                .WhereEqualTo("userId", userId)
                .GetSnapshotAsync();

            return snapshot.Documents.Select(d => d.ConvertTo<PaymentEntity>()).ToList();
        }

        public Task AddAsync(PaymentEntity paymentEntity)
            => AddAsync(CollectionName, paymentEntity.Id, paymentEntity);

        public Task UpdateAsync(string id, PaymentEntity paymentEntity)
            => UpdateAsync(CollectionName, id, paymentEntity);

        public Task DeleteAsync(string id)
            => DeleteAsync(CollectionName, id);
    }
}
