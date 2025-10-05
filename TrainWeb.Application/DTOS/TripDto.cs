using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Application.DTOS
{
    public sealed class TripDto
    {
        public string? Id { get; set; }
        public TrainDto? Train { get; set; }
        public DateTime? Departure { get; set; }
        public DateTime? Arrival { get; set; }
        public string? OriginStation { get; set; }
        public string? DestinationStation { get; set; }
        public int? SeatsAvailable { get; set; }
    }
}
