using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public class BookingDto
    {
        public string? Id { get; set; }

        public string? UserId { get; set; }
        public string? TripId { get; set; }
        public string? SeatId { get; set; }

        public string? TicketTypeId { get; set; } 

        public double? Amount { get; set; }

        public BookingStatus? Status { get; set; }
        public PaymentStatus? PaymentStatus { get; set; }

        public string? PaymentId { get; set; }
        public string? TicketId { get; set; }
        public string? TicketStatus { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }

        public Dictionary<string, object>? SeatSummary { get; set; }
        public Dictionary<string, object>? TripSummary { get; set; }
    }
}
