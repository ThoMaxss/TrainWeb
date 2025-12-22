using Google.Cloud.Firestore;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class PaymentEntity
    {
        [FirestoreDocumentId]
        public string Id { get; set; } = default!;

        [FirestoreProperty("userId")]
        public string? UserId { get; set; }

        [FirestoreProperty("bookingId")]
        public string? BookingId { get; set; }

        [FirestoreProperty("amount")]
        public double Amount { get; set; }

        // Firestore: "momo"/"visa"/...
        [FirestoreProperty("method")]
        public string Method { get; set; } = "momo";

        // Firestore: "pending"/"success"/"failed"
        [FirestoreProperty("status")]
        public string Status { get; set; } = "pending";

        [FirestoreProperty("createdAt")]
        public Timestamp CreatedAt { get; set; } = Timestamp.GetCurrentTimestamp();

        [FirestoreProperty("updateAt")]
        public Timestamp? UpdateAt { get; set; }

        // ===== Mapping =====
        public Payment ToDomain(Booking? booking)
        {
            var methodEnum = System.Enum.TryParse<PaymentMethod>(Method, true, out var m)
                ? m
                : PaymentMethod.Visa;

            var statusEnum = System.Enum.TryParse<PaymentStatus>(Status, true, out var s)
                ? s
                : PaymentStatus.Pending;

            return new Payment(
                id: Id,
                booking: booking,
                bookingId: BookingId ?? booking?.Id,
                amount: Amount,
                method: methodEnum,
                status: statusEnum,
                createdAt: CreatedAt.ToDateTime()
            );
        }

        public static PaymentEntity FromDomain(Payment payment) => new PaymentEntity
        {
            Id = payment.Id ?? Guid.NewGuid().ToString(),

            // ưu tiên Booking, nếu không có thì dùng BookingId
            UserId = payment.Booking?.UserId,
            BookingId = payment.BookingId ?? payment.Booking?.Id,

            Amount = payment.Amount,

            Method = payment.Method.ToString().ToLowerInvariant(),
            Status = payment.Status.ToString().ToLowerInvariant(),

            CreatedAt = Timestamp.FromDateTime(DateTime.SpecifyKind(payment.CreatedAt, DateTimeKind.Utc)),
            UpdateAt = Timestamp.GetCurrentTimestamp()
        };
    }
}
