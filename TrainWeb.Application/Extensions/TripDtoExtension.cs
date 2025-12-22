using System;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Application.DTOS
{
    public static class TripDtoExtension
    {
        public static TripDto ToDto(this Trip t) => new TripDto
        {
            Id = t.Id,

            TrainId = t.TrainId,
            TrainName = t.TrainName,
            TrainType = t.TrainType,

            Departure = t.Departure,
            Arrival = t.Arrival,

            OriginStationId = t.OriginStationId,
            OriginStationName = t.OriginStationName,

            DestinationStationId = t.DestinationStationId,
            DestinationStationName = t.DestinationStationName,

            SeatsAvailable = t.SeatsAvailable
        };

        public static Trip FromDto(this TripDto d)
        {
            if (d == null) throw new ArgumentNullException(nameof(d));

            if (string.IsNullOrWhiteSpace(d.TrainId)) throw new ArgumentException("TrainId is required");
            if (string.IsNullOrWhiteSpace(d.TrainName)) throw new ArgumentException("TrainName is required");
            if (string.IsNullOrWhiteSpace(d.TrainType)) throw new ArgumentException("TrainType is required");

            if (string.IsNullOrWhiteSpace(d.OriginStationId)) throw new ArgumentException("OriginStationId is required");
            if (string.IsNullOrWhiteSpace(d.OriginStationName)) throw new ArgumentException("OriginStationName is required");

            if (string.IsNullOrWhiteSpace(d.DestinationStationId)) throw new ArgumentException("DestinationStationId is required");
            if (string.IsNullOrWhiteSpace(d.DestinationStationName)) throw new ArgumentException("DestinationStationName is required");

            if (d.Departure == null) throw new ArgumentException("Departure is required");
            if (d.Arrival == null) throw new ArgumentException("Arrival is required");

            if (d.Arrival.Value <= d.Departure.Value)
                throw new ArgumentException("Arrival must be after Departure");

            var seats = d.SeatsAvailable ?? 0;
            if (seats < 0) throw new ArgumentException("SeatsAvailable must be >= 0");

            return new Trip(
                id: string.IsNullOrWhiteSpace(d.Id) ? "" : d.Id.Trim(),

                trainId: d.TrainId.Trim(),
                trainName: d.TrainName.Trim(),
                trainType: d.TrainType.Trim(),

                departure: d.Departure.Value,
                arrival: d.Arrival.Value,

                originStationId: d.OriginStationId.Trim(),
                originStationName: d.OriginStationName.Trim(),

                destinationStationId: d.DestinationStationId.Trim(),
                destinationStationName: d.DestinationStationName.Trim(),

                seatsAvailable: seats
            );
        }
    }
}
