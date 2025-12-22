using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Domain
{
    public class Payment
    {
        public string? Id { get; }

        public Booking? Booking { get; init; }   

        public string? BookingId { get; init; }  

        public double Amount { get; set; }

        public PaymentMethod Method { get; set; } = PaymentMethod.Visa;

        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

        public Payment(
            string? id,
            Booking? booking,
            string? bookingId,
            double amount,
            PaymentMethod method,
            PaymentStatus status,
            DateTime createdAt
        )
        {
            Id = id;
            Booking = booking;

            BookingId = !string.IsNullOrWhiteSpace(bookingId) ? bookingId : booking?.Id;

            Amount = amount;
            Method = method;
            Status = status;
            CreatedAt = createdAt;
        }
    }
}
