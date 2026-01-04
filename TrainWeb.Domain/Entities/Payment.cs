using System;
using TrainWeb.Domain.Enums;

namespace TrainWeb.Domain.Entities
{
    public class Payment
    {
        public string Id { get; set; }
        public string BookingId { get; set; }
        public string UserId { get; set; }
        public string Amount { get; set; }
        public PaymentMethod Method { get; set; }
        public PaymentStatus Status { get; set; }
        public string? TransactionReference { get; set; }
        public string? CardLastFourDigits { get; set; }
        public string? CardHolderName { get; set; }
        public string? BankCode { get; set; }
        public string? GatewayResponse { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ProcessedAt { get; set; }
        public string? FailureReason { get; set; }
        public int? RetryCount { get; set; }
        public string? IPAddress { get; set; }

        // Navigation properties
        public virtual Booking? Booking { get; set; }
        public virtual User? User { get; set; }

        public Payment()
        {
            Id = Guid.NewGuid().ToString();
            CreatedAt = DateTime.UtcNow;
            RetryCount = 0;
            Status = PaymentStatus.Pending;
        }
    }
}
