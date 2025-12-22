using Google.Cloud.Firestore;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class TicketEntity
    {
        [FirestoreDocumentId]
        public string Id { get; set; } = default!;

        [FirestoreProperty("bookingId")]
        public string BookingId { get; set; } = default!;

        [FirestoreProperty("ticketNumber")]
        public string TicketNumber { get; set; } = default!;

        [FirestoreProperty("qrCode")]
        public string QrCode { get; set; } = default!;

        // "active"/"used"/"cancelled"
        [FirestoreProperty("status")]
        public string Status { get; set; } = "active";

        [FirestoreProperty("createdAt")]
        public Timestamp CreatedAt { get; set; } = Timestamp.GetCurrentTimestamp();

        [FirestoreProperty("activeAt")]
        public Timestamp? ActiveAt { get; set; }

        public Ticket ToDomain()
        {
            var statusEnum = System.Enum.TryParse<TicketStatus>(Status, true, out var s)
                ? s
                : TicketStatus.Active;

            return new Ticket(
                id: Id,
                bookingId: BookingId,
                ticketNumber: TicketNumber,
                qrCode: QrCode,
                status: statusEnum,
                createdAt: DateTime.SpecifyKind(CreatedAt.ToDateTime(), DateTimeKind.Utc),
                activeAt: ActiveAt == null ? null : DateTime.SpecifyKind(ActiveAt.Value.ToDateTime(), DateTimeKind.Utc)
            );
        }

        public static TicketEntity FromDomain(Ticket ticket) => new TicketEntity
        {
            Id = ticket.Id ?? Guid.NewGuid().ToString(),
            BookingId = ticket.BookingId,
            TicketNumber = ticket.TicketNumber,
            QrCode = ticket.QrCode,
            Status = ticket.Status.ToString().ToLowerInvariant(),
            CreatedAt = Timestamp.FromDateTime(DateTime.SpecifyKind(ticket.CreatedAt, DateTimeKind.Utc)),
            ActiveAt = ticket.ActiveAt == null
                ? null
                : Timestamp.FromDateTime(DateTime.SpecifyKind(ticket.ActiveAt.Value, DateTimeKind.Utc))
        };
    }
}
