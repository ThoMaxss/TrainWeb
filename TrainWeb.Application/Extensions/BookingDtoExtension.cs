using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Application.DTOS;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Application.Extensions
{
    public static class BookingDtoExtension
    {
        public static BookingDto ToDto(this Booking @this) => new BookingDto
        {
            Id = @this.Id,
            User = @this.User.ToDto(),
            Trip = @this.Trip.ToDto(),
            Seat = @this.Seat.ToDto(),
            Status = @this.Status,
            CreatedAt = @this.CreatedAt,
        };

        public static Booking FromDto(this BookingDto @this) => new Booking(
            @this.Id,
            @this.User?.FromDto(),
            @this.Trip?.FromDto(),
            @this.Seat?.FromDto(),
            @this.Status,
            @this.CreatedAt
        );
    }
}
