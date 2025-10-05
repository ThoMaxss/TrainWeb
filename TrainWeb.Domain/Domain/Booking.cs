using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Enum;
using static TrainWeb.Domain.Entities.BookingEntity;

namespace TrainWeb.Domain.Domain
{
    public class Booking
    {
        public string? Id { get; }

        public User? User { get; }

        public Trip? Trip { get; }

        public Seat? Seat { get; }

        public BookingStatus? Status { get; }

        public DateTime? CreatedAt { get; }

        public Booking(string? id, User? user, Trip? trip, Seat? seat, BookingStatus? status, DateTime? createdAt)
        {
            Id = id;
            User = user;
            Trip = trip;
            Seat = seat;
            Status = status;
            CreatedAt = createdAt;
        }
    }
}
