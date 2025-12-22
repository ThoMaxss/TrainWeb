using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Domain
{
    public class Ticket
    {
        public string? Id { get; }
        public string BookingId { get; }
        public string TicketNumber { get; }
        public string QrCode { get; }
        public TicketStatus Status { get; set; } = TicketStatus.Active;
        public DateTime CreatedAt { get; }
        public DateTime? ActiveAt { get; }

        public Ticket(
            string? id,
            string bookingId,
            string ticketNumber,
            string qrCode,
            TicketStatus status,
            DateTime createdAt,
            DateTime? activeAt
        )
        {
            Id = id;
            BookingId = bookingId;
            TicketNumber = ticketNumber;
            QrCode = qrCode;
            Status = status;
            CreatedAt = createdAt;
            ActiveAt = activeAt;
        }
    }
}
