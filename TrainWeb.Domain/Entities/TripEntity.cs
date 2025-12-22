using Google.Cloud.Firestore;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class TripEntity
    {
        [FirestoreDocumentId]
        public string Id { get; set; } = default!;

        [FirestoreProperty("trainId")]
        public string TrainId { get; set; } = default!;

        [FirestoreProperty("trainName")]
        public string TrainName { get; set; } = default!;

        [FirestoreProperty("trainType")]
        public string TrainType { get; set; } = default!;

        [FirestoreProperty("departure")]
        public Timestamp Departure { get; set; } = Timestamp.GetCurrentTimestamp();

        [FirestoreProperty("arrival")]
        public Timestamp Arrival { get; set; } = Timestamp.GetCurrentTimestamp();

        [FirestoreProperty("originStationId")]
        public string OriginStationId { get; set; } = default!;

        [FirestoreProperty("originStationName")]
        public string OriginStationName { get; set; } = default!;

        [FirestoreProperty("destinationStationId")]
        public string DestinationStationId { get; set; } = default!;

        [FirestoreProperty("destinationStationName")]
        public string DestinationStationName { get; set; } = default!;

        [FirestoreProperty("seatsAvailable")]
        public int SeatsAvailable { get; set; }

        public Trip ToDomain() => new Trip(
            id: Id,
            trainId: TrainId,
            trainName: TrainName,
            trainType: TrainType,
            departure: Departure.ToDateTime(),
            arrival: Arrival.ToDateTime(),
            originStationId: OriginStationId,
            originStationName: OriginStationName,
            destinationStationId: DestinationStationId,
            destinationStationName: DestinationStationName,
            seatsAvailable: SeatsAvailable
        );

        public static TripEntity FromDomain(Trip t) => new TripEntity
        {
            Id = string.IsNullOrWhiteSpace(t.Id) ? Guid.NewGuid().ToString() : t.Id,

            TrainId = t.TrainId,
            TrainName = t.TrainName,
            TrainType = t.TrainType,

            Departure = Timestamp.FromDateTime(DateTime.SpecifyKind(t.Departure, DateTimeKind.Utc)),
            Arrival = Timestamp.FromDateTime(DateTime.SpecifyKind(t.Arrival, DateTimeKind.Utc)),

            OriginStationId = t.OriginStationId,
            OriginStationName = t.OriginStationName,
            DestinationStationId = t.DestinationStationId,
            DestinationStationName = t.DestinationStationName,

            SeatsAvailable = t.SeatsAvailable
        };
    }
}
