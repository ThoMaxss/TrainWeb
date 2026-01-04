using System;
using System.Collections.Generic;
using TrainWeb.Domain.Enums;

namespace TrainWeb.Domain.Entities
{
    public class Seat
    {
        public string Id { get; set; }
        public string TripId { get; set; }
        public string SeatNumber { get; set; }
        public SeatType SeatType { get; set; }
        public bool IsAvailable { get; set; }
        public string Price { get; set; }
        public string? BookedByUserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? BookedAt { get; set; }
        public string? BookingReference { get; set; }

        // Navigation properties
        public virtual Trip? Trip { get; set; }
        public virtual ICollection<Ticket>? Tickets { get; set; }

        public Seat()
        {
            Id = Guid.NewGuid().ToString();
            CreatedAt = DateTime.UtcNow;
            IsAvailable = true;
            Tickets = new List<Ticket>();
        }
    }
}
