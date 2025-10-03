using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrainWeb.Domain.Entities
{
    using global::TrainWeb.Domain.Domain;
    using Google.Cloud.Firestore;

    namespace TrainWeb.Domain.Entities
    {
        [FirestoreData]
        public class TripEntity
        {
            [FirestoreProperty] 
            public string Id { get; set; }
            [FirestoreProperty] 
            public string TrainId { get; set; }
            [FirestoreProperty] 
            public DateTime Departure { get; set; }
            [FirestoreProperty] 
            public DateTime Arrival { get; set; }
            [FirestoreProperty] 
            public string OriginStation { get; set; }
            [FirestoreProperty] 
            public string DestinationStation { get; set; }
            [FirestoreProperty] 
            public int SeatsAvailable { get; set; }

            public Trip ToDomain(TrainEntity? trainEntity) => new Trip(
                Id,
                trainEntity != null ? trainEntity.ToDomain() : null,
                Departure,
                Arrival,
                OriginStation,
                DestinationStation,
                SeatsAvailable
            );

            public static TripEntity FromDomain(Trip trip) => new TripEntity
            {
                Id = trip.Id ?? Guid.NewGuid().ToString(),
                TrainId = trip.Train.Id,
                Departure = trip.Departure ?? DateTime.UtcNow,
                Arrival = trip.Arrival ?? DateTime.UtcNow,
                OriginStation = trip.OriginStation,
                DestinationStation = trip.DestinationStation,
                SeatsAvailable = trip.SeatsAvailable ?? 0
            };
        }
    }

}
