namespace TrainWeb.Application.DTOs
{
    public class BookingDto
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string TripId { get; set; }
        public string BookingReference { get; set; }
        public string Status { get; set; }
        public int NumberOfPassengers { get; set; }
        public string TotalPrice { get; set; }
        public string? DiscountAmount { get; set; }
        public string? TaxAmount { get; set; }
        public string FinalAmount { get; set; }
        public string? PaymentId { get; set; }
        public string? Notes { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime? CancelledAt { get; set; }
        public string? CancellationReason { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation DTOs
        public UserDto? User { get; set; }
        public TripDto? Trip { get; set; }
        public List<TicketDto>? Tickets { get; set; }
    }
}
