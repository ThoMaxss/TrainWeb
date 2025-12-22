using Google.Cloud.Firestore;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class TrainEntity
    {
        [FirestoreDocumentId]
        public string Id { get; set; } = default!;

        [FirestoreProperty("name")]
        public string Name { get; set; } = default!;

        [FirestoreProperty("type")]
        public string Type { get; set; } = default!;

        [FirestoreProperty("createdAt")]
        public Timestamp CreatedAt { get; set; } = Timestamp.GetCurrentTimestamp();

        public Train ToDomain() => new Train(
            id: Id,
            name: Name,
            type: Type,
            createdAt: CreatedAt.ToDateTime()
        );

        public static TrainEntity FromDomain(Train train) => new TrainEntity
        {
            Id = string.IsNullOrWhiteSpace(train.Id) ? Guid.NewGuid().ToString() : train.Id!,
            Name = train.Name ?? "",
            Type = train.Type ?? "",

            CreatedAt = Timestamp.FromDateTime(
                DateTime.SpecifyKind(train.CreatedAt, DateTimeKind.Utc)
            )
        };
    }
}
