namespace TrainWeb.Application.DTOs
{
    public class PaymentDto
    {
        public string Id { get; set; }
        public string BookingId { get; set; }
        public string UserId { get; set; }
        public string Amount { get; set; }
        public string Method { get; set; }
        public string Status { get; set; }
        public string? TransactionReference { get; set; }
        public string? CardLastFourDigits { get; set; }
        public string? CardHolderName { get; set; }
        public string? BankCode { get; set; }
        public DateTime? ProcessedAt { get; set; }
        public string? FailureReason { get; set; }
        public int? RetryCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation DTOs
        public BookingDto? Booking { get; set; }
    }

    public class PaymentRequestDto
    {
        public string BookingId { get; set; }
        public string Amount { get; set; }
        public string Method { get; set; }
        public string? CardNumber { get; set; }
        public string? CardHolderName { get; set; }
        public string? ExpiryDate { get; set; }
        public string? CVV { get; set; }
        public string? PhoneNumber { get; set; }
        public string? IPAddress { get; set; }
    }
}
