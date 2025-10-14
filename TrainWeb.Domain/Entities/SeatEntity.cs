using Google.Cloud.Firestore;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities.TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class SeatEntity
    {
        [FirestoreProperty]
        public string Id { get; set; } = string.Empty;

        [FirestoreProperty]
        public string TripId { get; set; } = string.Empty;

        [FirestoreProperty]
        public string SeatNumber { get; set; } = string.Empty;

        [FirestoreProperty]
        public SeatType Type { get; set; } = SeatType.Hard;

        [FirestoreProperty]
        public bool IsAvailable { get; set; } = true;

        [FirestoreProperty]
        public double Price { get; set; } = 0;

        public Seat ToDomain(TripEntity? tripEntity, TrainEntity? trainEntity) => new Seat(
            Id,
            tripEntity != null ? tripEntity.ToDomain(trainEntity) : null,
            SeatNumber,
            Type,
            IsAvailable,
            Price
        );

        public static SeatEntity FromDomain(Seat seat) => new SeatEntity
        {
            Id = seat.Id ?? Guid.NewGuid().ToString(),
            TripId = seat.Trip?.Id ?? string.Empty,
            SeatNumber = seat.SeatNumber ?? string.Empty,
            Type = seat.Type ?? SeatType.Hard,
            IsAvailable = seat.IsAvailable ?? true,
            Price = seat.Price ?? 0
        };
    }
}
