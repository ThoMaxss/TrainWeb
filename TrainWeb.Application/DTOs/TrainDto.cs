namespace TrainWeb.Application.DTOs
{
    public class TrainDto
    {
        public string Id { get; set; }
        public string TrainNumber { get; set; }
        public string TrainName { get; set; }
        public string TrainType { get; set; }
        public int TotalSeats { get; set; }
        public int AvailableSeats { get; set; }
        public int HardSeats { get; set; }
        public int SoftSeats { get; set; }
        public string? Manufacturer { get; set; }
        public int? YearOfManufacture { get; set; }
        public string? MaxSpeed { get; set; }
        public string? Amenities { get; set; }
        public string? OperatingCompany { get; set; }
        public bool HasAC { get; set; }
        public bool HasWiFi { get; set; }
        public bool HasFoodService { get; set; }
        public bool HasToilet { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
