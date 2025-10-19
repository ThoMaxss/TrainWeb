using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public sealed class TicketDto
    {
        public string? Id { get; set; }
        public SeatDto? Seat { get; set; }
        public TicketTypeDto? TicketType { get; set; }
        public TicketStatus? Status { get; set; }
    }
}
