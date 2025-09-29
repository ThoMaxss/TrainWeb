using Google.Cloud.Firestore;
using TrainWeb.Domain.Entities;

namespace TrainWeb.Infrastructure.Persistence
{
    public class BookingRepository
    {
        private readonly FirestoreDb _db;
        private const string CollectionName = "Bookings";

        public BookingRepository(FirestoreDbContext context)
        {
            _db = context.Db;
        }

        public async Task<Booking?> GetByIdAsync(string id)
        {
            var doc = _db.Collection(CollectionName).Document(id);
            var snapshot = await doc.GetSnapshotAsync();
            return snapshot.Exists ? snapshot.ConvertTo<Booking>() : null;
        }

        public async Task<IEnumerable<Booking>> GetAllAsync()
        {
            var snapshot = await _db.Collection(CollectionName).GetSnapshotAsync();
            return snapshot.Documents.Select(d => d.ConvertTo<Booking>()).ToList();
        }

        public async Task AddAsync(Booking booking)
        {
            await _db.Collection(CollectionName).Document(booking.Id).SetAsync(booking);
        }

        public async Task UpdateAsync(Booking booking)
        {
            await _db.Collection(CollectionName).Document(booking.Id).SetAsync(booking, SetOptions.Overwrite);
        }

        public async Task DeleteAsync(string id)
        {
            await _db.Collection(CollectionName).Document(id).DeleteAsync();
        }
    }
}
