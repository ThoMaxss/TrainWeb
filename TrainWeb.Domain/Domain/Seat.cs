using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Domain
{
    public class Seat
    {
        public string? Id { get; }
        public Trip? Trip { get; }
        public string? SeatNumber { get; }
        public SeatType? Type { get; }
        public bool? IsAvailable { get; }
        public double? Price { get; }

        public Seat(string? id, Trip? trip, string? seatNumber, SeatType? type, bool? isAvailable, double? price)
        {
            Id = id;
            Trip = trip;
            SeatNumber = seatNumber;
            Type = type;
            IsAvailable = isAvailable;
            Price = price;
        }
    }
}
