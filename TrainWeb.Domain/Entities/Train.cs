using System;
using System.Collections.Generic;

namespace TrainWeb.Domain.Entities
{
    public class Train
    {
        public string Id { get; set; }
        public string TrainNumber { get; set; }
        public string TrainName { get; set; }
        public int TotalSeats { get; set; }
        public int AvailableSeats { get; set; }
        public int HardSeats { get; set; }
        public int SoftSeats { get; set; }
        public string TrainType { get; set; } // Express, Local, Suburban
        public string? Manufacturer { get; set; }
        public int? YearOfManufacture { get; set; }
        public string? MaxSpeed { get; set; } // in km/h
        public string? Amenities { get; set; } // JSON or comma-separated (WiFi, AC, Food service)
        public string? OperatingCompany { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; }
        public bool HasAC { get; set; }
        public bool HasWiFi { get; set; }
        public bool HasFoodService { get; set; }
        public bool HasToilet { get; set; }

        // Navigation properties
        public virtual ICollection<Trip>? Trips { get; set; }

        public Train()
        {
            Id = Guid.NewGuid().ToString();
            CreatedAt = DateTime.UtcNow;
            IsActive = true;
            Trips = new List<Trip>();
        }
    }
}
