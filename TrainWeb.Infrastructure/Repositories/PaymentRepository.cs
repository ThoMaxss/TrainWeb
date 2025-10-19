using Google.Cloud.Firestore;
using TrainWeb.Domain.Entities;
using TrainWeb.Application.Interfaces;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public class PaymentRepository : FirestoreRepository<PaymentEntity>, IPaymentRepository
    {
        private const string CollectionName = "Payments";

        public PaymentRepository(FirestoreDbContext context) : base(context) { }

        public async Task<PaymentEntity?> GetByIdAsync(string id)
        {
            return await GetByIdAsync(CollectionName, id);
        }

        public async Task<IEnumerable<PaymentEntity>> GetAllAsync()
        {
            return await GetAllAsync(CollectionName);
        }

        public async Task<IEnumerable<PaymentEntity>?> GetByBookingIdAsync(string bookingId)
        {
            var query = FirestoreDb.Collection(CollectionName).WhereEqualTo("BookingId", bookingId);

            var snapshot = await query.GetSnapshotAsync();

            return snapshot.Documents.Select(doc => doc.ConvertTo<PaymentEntity>()).ToList();
        }

        public async Task<PaymentEntity?> GetPendingByBookingIdAsync(string bookingId)
        {
            var query = await FirestoreDb.Collection(CollectionName).WhereEqualTo("BookingId", bookingId).WhereEqualTo("Status",1).GetSnapshotAsync();

            var snapshot = query.Documents.FirstOrDefault();

            if(snapshot == null)
            {
                return null;
            }    

            return snapshot.Exists ? snapshot.ConvertTo<PaymentEntity>() : null;
        }

        public async Task<IEnumerable<PaymentEntity>?> GetByUserIdAsync(string userId)
        {
            var query = FirestoreDb.Collection(CollectionName).WhereEqualTo("UserId", userId);

            var snapshot = await query.GetSnapshotAsync();

            return snapshot.Documents.Select(doc => doc.ConvertTo<PaymentEntity>()).ToList();
        }

        public async Task AddAsync(PaymentEntity paymentEntity)
        {
            await AddAsync(CollectionName, paymentEntity.Id, paymentEntity);
        }

        public async Task UpdateAsync(string id, PaymentEntity paymentEntity)
        {
            await UpdateAsync(CollectionName, id, paymentEntity);
        }

        public async Task DeleteAsync(string id)
        {
            await DeleteAsync(CollectionName, id);
        }
    }
}
