using Google.Cloud.Firestore;
using TrainWeb.Domain.Entities;
using TrainWeb.Application.Interfaces;

namespace TrainWeb.Infrastructure.Repositories
{
    public class PaymentService(FirestoreDbContext context) : IPaymentService
    {
        private readonly FirestoreDb _db = context.Db ?? throw new ArgumentNullException(nameof(context.Db));
        private const string CollectionName = "Payments";

        public async Task<Payment?> GetByIdAsync(string id)
        {
            DocumentReference docRef = _db.Collection(CollectionName).Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            return snapshot.Exists ? snapshot.ConvertTo<Payment>() : null;
        }

        public async Task<IEnumerable<Payment>> GetByBookingIdAsync(string bookingId)
        {
            Query query = _db.Collection(CollectionName).WhereEqualTo("BookingId", bookingId);
            QuerySnapshot snapshot = await query.GetSnapshotAsync();

            return snapshot.Documents.Select(doc => doc.ConvertTo<Payment>()).ToList();
        }

        public async Task AddAsync(Payment payment)
        {
            await _db.Collection(CollectionName).Document(payment.Id).SetAsync(payment);
        }

        public async Task UpdateAsync(Payment payment)
        {
            await _db.Collection(CollectionName).Document(payment.Id).SetAsync(payment, SetOptions.Overwrite);
        }
    }

    public class FirestoreDbContext
    {
        public FirestoreDb? Db { get; internal set; }
    }
}
