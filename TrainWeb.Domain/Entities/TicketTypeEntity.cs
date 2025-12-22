using Google.Cloud.Firestore;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class TicketTypeEntity
    {
        [FirestoreDocumentId]
        public string Id { get; set; } = default!;

        [FirestoreProperty("name")]
        public string Name { get; set; } = default!;

        [FirestoreProperty("discount")]
        public double Discount { get; set; }

        [FirestoreProperty("status")]
        public string Status { get; set; } = "active";

        [FirestoreProperty("createdAt")]
        public Timestamp CreatedAt { get; set; } = Timestamp.GetCurrentTimestamp();

        public TicketType ToDomain() => new TicketType(Id, Name, Discount);

        public static TicketTypeEntity FromDomain(TicketType t) => new TicketTypeEntity
        {
            Id = t.Id,
            Name = t.Name,
            Discount = t.Discount,

            Status = "active",

            CreatedAt = Timestamp.GetCurrentTimestamp()
        };
    }
}
