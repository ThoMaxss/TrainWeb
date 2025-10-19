using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Application.Extensions;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Application.DTOS
{
    public static class TicketTypeDtoExtension
    {
        public static TicketTypeDto ToDto(this TicketType @this) => new TicketTypeDto
        {
            Id = @this.Id,
            Name = @this.Name,
            Discount = @this.Discount,
        };

        public static TicketType FromDto(this TicketTypeDto @this) => new TicketType(
            @this.Id,
            @this.Name,
            @this.Discount
        );
    }
}
