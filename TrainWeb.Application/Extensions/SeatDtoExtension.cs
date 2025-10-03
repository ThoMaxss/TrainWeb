using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Application.DTOS
{
    public static class SeatDtoExtension
    {
        public static SeatDto ToDto(this Seat @this) => new SeatDto
        {
            Id = @this.Id,
            Trip = @this.Trip?.ToDto(),
            SeatNumber = @this.SeatNumber,
            Type = @this.Type,
            IsAvailable = @this.IsAvailable,
            Price = @this.Price
        };

        public static Seat FromDto(this SeatDto @this) => new Seat(
            @this.Id,
            @this.Trip.FromDto(),
            @this.SeatNumber,
            @this.Type,
            @this.IsAvailable,
            @this.Price
        );
    }
}
