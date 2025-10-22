using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Application.Extensions;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Application.DTOS
{
    public static class TicketDtoExtension
    {
        public static TicketDto ToDto(this Ticket @this) => new TicketDto
        {
            Id = @this.Id,
            Seat = @this.Seat?.ToDto(),
            TicketType = @this.TicketType?.ToDto(),
            Status = @this.Status,
        };

        public static Ticket FromDto(this TicketDto @this) => new Ticket(
            @this.Id,
            @this.Seat?.FromDto(),
            @this.TicketType?.FromDto(),
            @this.Status
        );
    }
}
