using Google.Cloud.Firestore;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class SeatEntity
    {
        [FirestoreDocumentId]
        public string Id { get; set; } = default!;

        [FirestoreProperty("tripId")]
        public string? TripId { get; set; }

        [FirestoreProperty("seatNumber")]
        public string? SeatNumber { get; set; }

        [FirestoreProperty("type")]
        public SeatType Type { get; set; } = SeatType.Hard;

        [FirestoreProperty("isAvailable")]
        public bool IsAvailable { get; set; } = true;

        [FirestoreProperty("price")]
        public double Price { get; set; } = 0;

        public Seat ToDomain(Trip? trip) => new Seat(
            Id,
            trip,
            SeatNumber,
            Type,
            IsAvailable,
            Price
        );

        public static SeatEntity FromDomain(Seat seat) => new SeatEntity
        {
            Id = seat.Id ?? Guid.NewGuid().ToString(),
            TripId = seat.Trip?.Id,
            SeatNumber = seat.SeatNumber,
            Type = seat.Type ?? SeatType.Hard,
            IsAvailable = seat.IsAvailable ?? true,
            Price = seat.Price ?? 0
        };
    }
}
