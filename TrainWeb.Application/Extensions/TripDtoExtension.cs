using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Application.DTOS
{
    public static class TripDtoExtension
    {
        public static TripDto ToDto(this Trip @this) => new TripDto
        {
            Id = @this.Id,
            Train = @this.Train.ToDto(),
            Departure = @this.Departure,
            Arrival = @this.Arrival,
            OriginStation = @this.OriginStation,
            DestinationStation = @this.DestinationStation,
            SeatsAvailable = @this.SeatsAvailable,
        };

        public static Trip FromDto(this TripDto @this)
        {
            if (@this == null)
                throw new ArgumentNullException(nameof(@this), "TripDto is null");

            Console.WriteLine($"TripDto => Id={@this.Id}, TrainDto={(@this.Train != null ? "OK" : "null")}");

            var train = @this.Train?.FromDto();
            Console.WriteLine($"Mapped Train => {(train != null ? "OK" : "null")}");

            var trip = new Trip(
                @this.Id,
                train,
                @this.Departure,
                @this.Arrival,
                @this.OriginStation,
                @this.DestinationStation,
                @this.SeatsAvailable
            );

            Console.WriteLine($"Mapped Trip => {(trip != null ? "OK" : "null")}");

            return trip;
        }

    }
}
