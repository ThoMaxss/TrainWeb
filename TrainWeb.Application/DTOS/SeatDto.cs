using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public sealed class SeatDto
    {
        public string? Id { get; set; }
        public TripDto? Trip { get; set; }
        public string? SeatNumber { get; set; }
        public SeatType? Type { get; set; }
        public bool? IsAvailable { get; set; }
        public double? Price { get; set; }
    }
}
