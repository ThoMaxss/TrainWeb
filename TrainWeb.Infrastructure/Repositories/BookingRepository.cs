using Google.Cloud.Firestore;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public class BookingRepository : FirestoreRepository<BookingEntity>, IBookingRepository
    {
        private const string CollectionName = "bookings";

        public BookingRepository(FirestoreDbContext context) : base(context) { }

        public Task<BookingEntity?> GetByIdAsync(string id)
            => GetByIdAsync(CollectionName, id);

        public Task<IEnumerable<BookingEntity>> GetAllAsync()
            => GetAllAsync(CollectionName);

        public async Task<IEnumerable<BookingEntity>> GetByUserIdAsync(string userId)
        {
            var snapshot = await FirestoreDb.Collection(CollectionName)
                .WhereEqualTo("userId", userId)
                .GetSnapshotAsync();

            return snapshot.Documents.Select(d =>
            {
                var e = d.ConvertTo<BookingEntity>();
                e.Id = d.Id;
                return e;
            }).ToList();
        }

        public async Task<IEnumerable<BookingEntity>> GetActiveBookingsByTripSeatAsync(string tripId, string seatId)
        {
            // active = reserved hoặc paid
            var snapshot = await FirestoreDb.Collection(CollectionName)
                .WhereEqualTo("tripId", tripId)
                .WhereEqualTo("seatId", seatId)
                .WhereIn("status", new object[] { "reserved", "paid" })
                .GetSnapshotAsync();

            return snapshot.Documents.Select(d =>
            {
                var e = d.ConvertTo<BookingEntity>();
                e.Id = d.Id;
                return e;
            }).ToList();
        }

        public Task AddAsync(BookingEntity bookingEntity)
            => AddAsync(CollectionName, bookingEntity.Id, bookingEntity);

        public Task UpdateAsync(string id, BookingEntity bookingEntity)
            => UpdateAsync(CollectionName, id, bookingEntity);

        public Task DeleteAsync(string id)
            => DeleteAsync(CollectionName, id);
    }
}
