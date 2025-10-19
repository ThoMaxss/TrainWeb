using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public sealed class TicketTypeDto
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public double? Discount { get; set; }
    }
}
