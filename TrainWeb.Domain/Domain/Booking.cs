using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Domain
{
    public class Booking
    {
        public string? Id { get; }

        public string UserId { get; }
        public string TripId { get; }
        public string SeatId { get; }

        public string? TicketTypeId { get; } 

        public double Amount { get; set; }

        public BookingStatus Status { get; set; }
        public PaymentStatus PaymentStatus { get; set; }

        public string? PaymentId { get; set; }
        public string? TicketId { get; set; }
        public string? TicketStatus { get; set; }

        public DateTime CreatedAt { get; }
        public DateTime? ExpiresAt { get; }

        public Dictionary<string, object>? SeatSummary { get; set; }
        public Dictionary<string, object>? TripSummary { get; set; }

        public Booking(
            string? id,
            string userId,
            string tripId,
            string seatId,
            string? ticketTypeId,      
            double amount,
            BookingStatus status,
            PaymentStatus paymentStatus,
            string? paymentId,
            string? ticketId,
            string? ticketStatus,
            DateTime createdAt,
            DateTime? expiresAt
        )
        {
            Id = id;
            UserId = userId;
            TripId = tripId;
            SeatId = seatId;

            TicketTypeId = ticketTypeId; 

            Amount = amount;
            Status = status;
            PaymentStatus = paymentStatus;
            PaymentId = paymentId;
            TicketId = ticketId;
            TicketStatus = ticketStatus;
            CreatedAt = createdAt;
            ExpiresAt = expiresAt;
        }
    }
}
