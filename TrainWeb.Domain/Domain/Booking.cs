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

        public Ticket? Ticket { get; }

        public double? Price { get; set; }

        public BookingStatus? Status { get; set; }

        public DateTime? CreatedAt { get; }

        public Booking(string? id, User? user, Ticket? ticket, double? price, BookingStatus? status, DateTime? createdAt)
        {
            Id = id;
            User = user;
            Ticket = ticket;
            Price = price;
            Status = status;
            CreatedAt = createdAt;
        }
    }
}
