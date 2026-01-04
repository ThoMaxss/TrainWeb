namespace TrainWeb.Application.DTOs
{
    public class TicketDto
    {
        public string Id { get; set; }
        public string BookingId { get; set; }
        public string UserId { get; set; }
        public string SeatId { get; set; }
        public string? TicketTypeId { get; set; }
        public string TicketNumber { get; set; }
        public string SeatNumber { get; set; }
        public string DepartureStation { get; set; }
        public string ArrivalStation { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public DateTime JourneyDate { get; set; }
        public string Price { get; set; }
        public string? DiscountAmount { get; set; }
        public string SeatType { get; set; } // Enum name
        public string Status { get; set; } // Enum name
        public string? QRCode { get; set; }
        public string? PassengerName { get; set; }
        public string? PassengerId { get; set; }
        public DateTime? UsedAt { get; set; }
        public DateTime? CancelledAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation DTOs
        public SeatDto? Seat { get; set; }
        public TicketTypeDto? TicketType { get; set; }
    }
}
