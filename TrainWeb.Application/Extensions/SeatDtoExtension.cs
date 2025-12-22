using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.DTOS
{
    public static class SeatDtoExtension
    {
        public static SeatDto ToDto(this SeatEntity e) => new SeatDto
        {
            Id = e.Id,
            TripId = e.TripId,
            SeatNumber = e.SeatNumber,
            Type = e.Type,
            IsAvailable = e.IsAvailable,
            Price = e.Price
        };

        public static SeatEntity FromDto(this SeatDto d) => new SeatEntity
        {
            Id = d.Id ?? "",
            TripId = d.TripId,
            SeatNumber = d.SeatNumber,
            Type = d.Type,
            IsAvailable = d.IsAvailable,
            Price = d.Price
        };
    }
}
