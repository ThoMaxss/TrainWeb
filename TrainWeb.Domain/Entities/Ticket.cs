using System;

namespace TrainWeb.Domain.Entities
{
    public class Ticket
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string BookingId { get; set; }
        public string SeatId { get; set; }
        public string? TicketTypeId { get; set; }
        public string TicketNumber { get; set; }
        public string SeatNumber { get; set; }
        public DateTime JourneyDate { get; set; }
        public string DepartureStation { get; set; }
        public string ArrivalStation { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public string Price { get; set; }
        public string? DiscountAmount { get; set; }
        public int Status { get; set; } // 0=Active, 1=Used, 2=Cancelled
        public string? QRCode { get; set; }
        public string? PassengerName { get; set; }
        public string? PassengerId { get; set; }
        public int SeatType { get; set; } // 0=Hard, 1=Soft
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? UsedAt { get; set; }
        public DateTime? CancelledAt { get; set; }

        // Navigation properties
        public virtual User? User { get; set; }
        public virtual Booking? Booking { get; set; }
        public virtual Seat? Seat { get; set; }
        public virtual TicketType? TicketType { get; set; }

        public Ticket()
        {
            Id = Guid.NewGuid().ToString();
            CreatedAt = DateTime.UtcNow;
        }
    }
}
