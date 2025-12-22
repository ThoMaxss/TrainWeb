namespace TrainWeb.Domain.Domain
{
    public class Trip
    {
        public string Id { get; }

        public string TrainId { get; }
        public string TrainName { get; }
        public string TrainType { get; }

        public DateTime Departure { get; }
        public DateTime Arrival { get; }

        public string OriginStationId { get; }
        public string OriginStationName { get; }

        public string DestinationStationId { get; }
        public string DestinationStationName { get; }

        public int SeatsAvailable { get; }

        public Trip(
            string id,
            string trainId,
            string trainName,
            string trainType,
            DateTime departure,
            DateTime arrival,
            string originStationId,
            string originStationName,
            string destinationStationId,
            string destinationStationName,
            int seatsAvailable
        )
        {
            Id = id;
            TrainId = trainId;
            TrainName = trainName;
            TrainType = trainType;
            Departure = departure;
            Arrival = arrival;
            OriginStationId = originStationId;
            OriginStationName = originStationName;
            DestinationStationId = destinationStationId;
            DestinationStationName = destinationStationName;
            SeatsAvailable = seatsAvailable;
        }
    }
}
