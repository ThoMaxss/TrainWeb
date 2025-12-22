using Google.Cloud.Firestore;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class BookingEntity
    {
        [FirestoreDocumentId]
        public string Id { get; set; } = default!;

        [FirestoreProperty("userId")]
        public string UserId { get; set; } = default!;

        [FirestoreProperty("tripId")]
        public string TripId { get; set; } = default!;

        [FirestoreProperty("seatId")]
        public string SeatId { get; set; } = default!;

        [FirestoreProperty("ticketTypeId")]
        public string? TicketTypeId { get; set; } // ✅ giảm giá

        [FirestoreProperty("amount")]
        public double Amount { get; set; }

        // lowercase string để query ổn định
        [FirestoreProperty("status")]
        public string Status { get; set; } = "reserved"; // reserved/paid/cancelled

        [FirestoreProperty("paymentStatus")]
        public string PaymentStatus { get; set; } = "pending"; // pending/success/failed

        [FirestoreProperty("paymentId")]
        public string? PaymentId { get; set; }

        [FirestoreProperty("ticketId")]
        public string? TicketId { get; set; }

        [FirestoreProperty("ticketStatus")]
        public string? TicketStatus { get; set; }

        [FirestoreProperty("createdAt")]
        public Timestamp CreatedAt { get; set; } = Timestamp.GetCurrentTimestamp();

        [FirestoreProperty("expiresAt")]
        public Timestamp? ExpiresAt { get; set; }

        [FirestoreProperty("seatSummary")]
        public Dictionary<string, object>? SeatSummary { get; set; }

        [FirestoreProperty("tripSummary")]
        public Dictionary<string, object>? TripSummary { get; set; }

        // ===== Mapping =====
        public Booking ToDomain()
        {
            var bookingStatus = System.Enum.TryParse<BookingStatus>(Status, true, out var bs)
                ? bs
                : BookingStatus.Reserved;

            var payStatus = System.Enum.TryParse<PaymentStatus>(PaymentStatus, true, out var ps)
                ? ps
                : global::TrainWeb.Domain.Enum.PaymentStatus.Pending;

            return new Booking(
                id: Id,
                userId: UserId,
                tripId: TripId,
                seatId: SeatId,
                ticketTypeId: TicketTypeId,          
                amount: Amount,
                status: bookingStatus,
                paymentStatus: payStatus,
                paymentId: PaymentId,
                ticketId: TicketId,
                ticketStatus: TicketStatus,
                createdAt: CreatedAt.ToDateTime(),
                expiresAt: ExpiresAt?.ToDateTime()
            )
            {
                SeatSummary = SeatSummary,
                TripSummary = TripSummary
            };
        }

        public static BookingEntity FromDomain(Booking booking)
        {
            return new BookingEntity
            {
                Id = booking.Id ?? Guid.NewGuid().ToString(),
                UserId = booking.UserId,
                TripId = booking.TripId,
                SeatId = booking.SeatId,

                TicketTypeId = booking.TicketTypeId, 

                Amount = booking.Amount,

                Status = booking.Status.ToString().ToLowerInvariant(),
                PaymentStatus = booking.PaymentStatus.ToString().ToLowerInvariant(),

                PaymentId = booking.PaymentId,
                TicketId = booking.TicketId,
                TicketStatus = booking.TicketStatus,

                CreatedAt = Timestamp.FromDateTime(DateTime.SpecifyKind(booking.CreatedAt, DateTimeKind.Utc)),
                ExpiresAt = booking.ExpiresAt == null
                    ? null
                    : Timestamp.FromDateTime(DateTime.SpecifyKind(booking.ExpiresAt.Value, DateTimeKind.Utc)),

                SeatSummary = booking.SeatSummary,
                TripSummary = booking.TripSummary
            };
        }
    }
}
