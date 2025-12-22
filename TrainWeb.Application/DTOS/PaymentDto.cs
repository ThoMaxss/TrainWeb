using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public sealed class PaymentDto
    {
        public string? Id { get; set; }

        public string? BookingId { get; set; }

        public BookingDto? Booking { get; set; }

        public double? Amount { get; set; }
        public PaymentMethod? Method { get; set; }
        public PaymentStatus? Status { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
