namespace TrainWeb.Application.DTOs
{
    public class TripDto
    {
        public string Id { get; set; }
        public string TrainId { get; set; }
        public string? TrainName { get; set; }
        public TrainDto? Train { get; set; }
        public string OriginStation { get; set; }
        public string DestinationStation { get; set; }
        public DateTime TripDate { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public int Duration { get; set; }
        public string BasePrice { get; set; }
        public string? Discount { get; set; }
        public int SeatsAvailable { get; set; }
        public int TotalSeats { get; set; }
        public string Status { get; set; }
        public string? Notes { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<SeatDto>? Seats { get; set; }
    }
}
