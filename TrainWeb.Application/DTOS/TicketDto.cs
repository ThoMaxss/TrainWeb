using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public sealed class TicketDto
    {
        public string? Id { get; set; }

        public string? BookingId { get; set; }
        public string? TicketNumber { get; set; }
        public string? QrCode { get; set; }

        public TicketStatus? Status { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? ActiveAt { get; set; }
    }
}
