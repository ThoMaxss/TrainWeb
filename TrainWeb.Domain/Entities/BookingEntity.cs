using Google.Cloud.Firestore;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class BookingEntity
    {
        [FirestoreProperty]
        public string Id { get; set; }
        [FirestoreProperty]
        public string? UserId { get; set; }

        [FirestoreProperty]
        public string? TicketId { get; set; }

        [FirestoreProperty]
        public double? Price { get; set; }
        [FirestoreProperty]
        public BookingStatus Status { get; set; }

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }

        public Booking ToDomain(User? user, Ticket? ticket)
        {
            return new Booking(Id, user, ticket, Price, Status, CreatedAt);
        }

        public static BookingEntity FromDomain(Booking booking) => new BookingEntity
        {
            Id = booking.Id ?? Guid.NewGuid().ToString(),
            UserId = booking.User?.Id,
            TicketId = booking.Ticket?.Id,
            Price = booking.Price,
            Status = booking.Status ?? BookingStatus.Reserved,
            CreatedAt = DateTime.UtcNow
        };
    }
}
