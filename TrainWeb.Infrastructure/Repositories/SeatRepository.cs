using Google.Cloud.Firestore;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public class SeatRepository : ISeatRepository
    {
        private readonly FirestoreDb _db;

        private const string Trips = "trips";
        private const string Seats = "seats";

        public SeatRepository(FirestoreDbContext context)
        {
            _db = context.Db ?? throw new ArgumentNullException(nameof(context.Db));
        }

        private CollectionReference SeatsCol(string tripId)
            => _db.Collection(Trips).Document(tripId).Collection(Seats);

        public async Task<SeatEntity?> GetByIdAsync(string tripId, string seatId)
        {
            var snap = await SeatsCol(tripId).Document(seatId).GetSnapshotAsync();
            if (!snap.Exists) return null;

            var e = snap.ConvertTo<SeatEntity>();
            e.Id = snap.Id;
            e.TripId = tripId;
            return e;
        }

        public async Task<IEnumerable<SeatEntity>> GetByTripIdAsync(string tripId)
        {
            var snap = await SeatsCol(tripId).GetSnapshotAsync();
            return snap.Documents.Select(d =>
            {
                var e = d.ConvertTo<SeatEntity>();
                e.Id = d.Id;
                e.TripId = tripId;
                return e;
            }).ToList();
        }

        public Task AddAsync(string tripId, SeatEntity seatEntity)
            => SeatsCol(tripId).Document(seatEntity.Id).SetAsync(seatEntity);

        public Task UpdateAsync(string tripId, string seatId, SeatEntity seatEntity)
            => SeatsCol(tripId).Document(seatId).SetAsync(seatEntity, SetOptions.MergeAll);

        public Task DeleteAsync(string tripId, string seatId)
            => SeatsCol(tripId).Document(seatId).DeleteAsync();

        public Task UpdateAvailabilityAsync(string tripId, string seatId, bool isAvailable)
            => SeatsCol(tripId).Document(seatId).UpdateAsync(new Dictionary<string, object>
            {
                { "isAvailable", isAvailable }
            });
    }
}
