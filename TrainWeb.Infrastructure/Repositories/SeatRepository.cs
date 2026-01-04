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

            return ConvertSnapshotToEntity(snap, tripId);
        }

        public async Task<IEnumerable<SeatEntity>> GetByTripIdAsync(string tripId)
        {
            var snap = await SeatsCol(tripId).GetSnapshotAsync();
            return snap.Documents.Select(d => ConvertSnapshotToEntity(d, tripId)).ToList();
        }

        private static SeatEntity ConvertSnapshotToEntity(DocumentSnapshot d, string tripId)
        {
            // Read raw fields and be tolerant when parsing enums from Firestore (case-insensitive)
            var e = new SeatEntity();
            e.Id = d.Id;
            e.TripId = tripId;

            if (d.TryGetValue("seatNumber", out string? seatNumber)) e.SeatNumber = seatNumber;

            // Parse type as string (allow "Hard", "hard", "Soft", etc.)
            if (d.TryGetValue("type", out object? rawType) && rawType != null)
            {
                var typeStr = rawType.ToString() ?? string.Empty;
                if (Enum.TryParse<TrainWeb.Domain.Enum.SeatType>(typeStr, true, out var parsed))
                {
                    e.Type = parsed;
                }
                else
                {
                    // fallback to default
                    e.Type = TrainWeb.Domain.Enum.SeatType.Hard;
                }
            }

            if (d.TryGetValue("isAvailable", out bool isAvailable)) e.IsAvailable = isAvailable;
            if (d.TryGetValue("price", out double price)) e.Price = price;

            return e;
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
