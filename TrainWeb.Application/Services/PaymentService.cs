using Google.Cloud.Firestore;
using TrainWeb.Domain.Entities;
using TrainWeb.Application.Interfaces;

namespace TrainWeb.Application.Services
{
    public class PaymentService(FirestoreDbContext context) : IPaymentService
    {
        private readonly FirestoreDb _db = context.Db ?? throw new ArgumentNullException(nameof(context.Db));
        private const string CollectionName = "Payments";

        public async Task<PaymentEntity?> GetByIdAsync(string id)
        {
            DocumentReference docRef = _db.Collection(CollectionName).Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            return snapshot.Exists ? snapshot.ConvertTo<PaymentEntity>() : null;
        }

        public async Task<IEnumerable<PaymentEntity>> GetByBookingIdAsync(string bookingId)
        {
            Query query = _db.Collection(CollectionName).WhereEqualTo("BookingId", bookingId);
            QuerySnapshot snapshot = await query.GetSnapshotAsync();

            return snapshot.Documents.Select(doc => doc.ConvertTo<PaymentEntity>()).ToList();
        }

        public async Task AddAsync(PaymentEntity payment)
        {
            await _db.Collection(CollectionName).Document(payment.Id).SetAsync(payment);
        }

        public async Task UpdateAsync(PaymentEntity payment)
        {
            await _db.Collection(CollectionName).Document(payment.Id).SetAsync(payment, SetOptions.Overwrite);
        }
    }

    public class FirestoreDbContext
    {
        public FirestoreDb? Db { get; internal set; }
    }
}
