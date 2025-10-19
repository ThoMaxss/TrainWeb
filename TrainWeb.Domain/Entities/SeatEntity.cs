using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        public string Id { get; set; }
        [FirestoreProperty]
        public string? TripId { get; set; }
        [FirestoreProperty]
        public string? SeatNumber { get; set; }
        [FirestoreProperty]
        public SeatType Type { get; set; }
        [FirestoreProperty]
        public bool IsAvailable { get; set; }
        [FirestoreProperty]
        public double? Price { get; set; }

        public Seat ToDomain(Trip? trip) => new Seat(
            Id,
            trip,
            SeatNumber,
            Type,
            IsAvailable,
            Price
        );

        public static SeatEntity FromDomain(Seat seat) => new SeatEntity {
            Id = seat.Id ?? Guid.NewGuid().ToString(),
            TripId = seat.Trip?.Id,
            SeatNumber = seat.SeatNumber,
            Type = seat.Type ?? SeatType.Hard,
            IsAvailable = seat.IsAvailable ?? true,
            Price = seat.Price ?? 0
        };
    }
}
