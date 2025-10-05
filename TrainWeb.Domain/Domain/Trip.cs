using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrainWeb.Domain.Domain
{
    public class Trip
    {
        public string? Id { get; }
        public Train? Train { get; }
        public DateTime? Departure { get; }
        public DateTime? Arrival { get; }
        public string? OriginStation { get; }
        public string? DestinationStation { get; }
        public int? SeatsAvailable { get; }

        public Trip(string? id, Train? train, DateTime? departure, DateTime? arrival, string? originStation, string? destinationStation, int? seatsAvailable)
        {
            Id = id;
            Train = train;
            Departure = departure;
            Arrival = arrival;
            OriginStation = originStation;
            DestinationStation = destinationStation;
            SeatsAvailable = seatsAvailable;
        }
    }
}
