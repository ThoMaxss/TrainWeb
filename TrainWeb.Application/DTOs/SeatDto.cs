namespace TrainWeb.Application.DTOs
{
    public class SeatDto
    {
        public string Id { get; set; }
        public string TripId { get; set; }
        public string SeatNumber { get; set; }
        public string SeatType { get; set; }
        public string Price { get; set; }
        public bool IsAvailable { get; set; }
        public string? BookedByUserId { get; set; }
        public string? BookingReference { get; set; }
        public DateTime? BookedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
