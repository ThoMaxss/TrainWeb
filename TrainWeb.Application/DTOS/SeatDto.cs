using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public sealed class SeatDto
    {
        public string? Id { get; set; }
        public string? TripId { get; set; }
        public string? SeatNumber { get; set; }
        public SeatType Type { get; set; } = SeatType.Hard;
        public bool IsAvailable { get; set; } = true;
        public double Price { get; set; } = 0;
    }
}
