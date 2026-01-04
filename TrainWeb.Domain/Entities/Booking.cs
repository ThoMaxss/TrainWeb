using System;
using System.Collections.Generic;
using TrainWeb.Domain.Enums;

namespace TrainWeb.Domain.Entities
{
    public class Booking
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string TripId { get; set; }
        public string BookingReference { get; set; }
        public BookingStatus Status { get; set; }
        public int NumberOfPassengers { get; set; }
        public string TotalPrice { get; set; }
        public string? DiscountAmount { get; set; }
        public string? TaxAmount { get; set; }
        public string FinalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime? CancelledAt { get; set; }
        public string? CancellationReason { get; set; }
        public string? PaymentId { get; set; }
        public string? Notes { get; set; }

        // Navigation properties
        public virtual User? User { get; set; }
        public virtual Trip? Trip { get; set; }
        public virtual ICollection<Ticket>? Tickets { get; set; }
        public virtual Payment? Payment { get; set; }

        public Booking()
        {
            Id = Guid.NewGuid().ToString();
            BookingReference = $"BK{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
            CreatedAt = DateTime.UtcNow;
            Tickets = new List<Ticket>();
        }
    }
}
