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
        public static BookingDto? ToDto(this Booking? @this)
        {
            if (@this == null) return null;

            return new BookingDto
            {
                Id = @this.Id,
                User = @this.User?.ToDto(),   
                Ticket = @this.Ticket?.ToDto(),
                Price = @this.Price,
                Status = @this.Status,
                CreatedAt = @this.CreatedAt,
            };
        }

        public static Booking FromDto(this BookingDto @this) => new Booking(
            @this.Id,
            @this.User?.FromDto(), 
            @this.Ticket?.FromDto(),
            null,
            @this.Status,
            @this.CreatedAt
        );
    }

}
