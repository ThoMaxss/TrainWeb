using System;
using System.Collections.Generic;

namespace TrainWeb.Domain.Entities
{
    public class Trip
    {
        public string Id { get; set; }
        public string TrainId { get; set; }
        public string OriginStation { get; set; }
        public string DestinationStation { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public int SeatsAvailable { get; set; }
        public int TotalSeats { get; set; }
        public string BasePrice { get; set; }
        public string Status { get; set; } // Active, Cancelled, Completed
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; }
        public DateTime TripDate { get; set; }
        public int Duration { get; set; } // in minutes
        public string? Discount { get; set; }
        public string? Notes { get; set; }

        // Navigation properties
        public virtual Train? Train { get; set; }
        public virtual ICollection<Seat>? Seats { get; set; }
        public virtual ICollection<Booking>? Bookings { get; set; }
        public virtual ICollection<Feedback>? Feedbacks { get; set; }

        public Trip()
        {
            Id = Guid.NewGuid().ToString();
            CreatedAt = DateTime.UtcNow;
            IsActive = true;
            Status = "Active";
            Seats = new List<Seat>();
            Bookings = new List<Booking>();
            Feedbacks = new List<Feedback>();
        }
    }
}
