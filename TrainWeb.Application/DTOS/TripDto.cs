using System;

namespace TrainWeb.Application.DTOS
{
    public sealed class TripDto
    {
        public string? Id { get; set; }

        public string? TrainId { get; set; }
        public string? TrainName { get; set; }
        public string? TrainType { get; set; }

        public DateTime? Departure { get; set; }
        public DateTime? Arrival { get; set; }

        public string? OriginStationId { get; set; }
        public string? OriginStationName { get; set; }

        public string? DestinationStationId { get; set; }
        public string? DestinationStationName { get; set; }

        public int? SeatsAvailable { get; set; }
    }
}
