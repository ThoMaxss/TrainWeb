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
    public class BookingEntity
    {
        [FirestoreProperty]
        public string Id { get; set; }
        [FirestoreProperty]
        public string UserId { get; set; }

        [FirestoreProperty]
        public string TripId { get; set; }

        [FirestoreProperty]
        public string SeatId { get; set; }

        [FirestoreProperty("StatusFieldName")]
        public BookingStatus Status { get; set; }

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }

        public Booking ToDomain(UserEntity? userEntity, TripEntity? tripEntity, SeatEntity? seatEntity, TrainEntity? trainEntity) 
            => new Booking(
            Id,
            userEntity != null ? userEntity.ToDomain() : null,
            tripEntity != null ? tripEntity.ToDomain(trainEntity) : null,
            seatEntity != null ? seatEntity.ToDomain(tripEntity, trainEntity) : null,
            Status,
            CreatedAt);

        public static BookingEntity FromDomain(Booking booking) => new BookingEntity
        {
            Id = booking.Id ?? Guid.NewGuid().ToString(),
            UserId = booking.User.Id,
            TripId = booking.Trip.Id,
            SeatId = booking.Seat.Id,
            Status = booking.Status ?? BookingStatus.Reserved,
            CreatedAt = DateTime.UtcNow
        };
    }
}
