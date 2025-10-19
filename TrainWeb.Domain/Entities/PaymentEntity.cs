using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class PaymentEntity
    {
        [FirestoreProperty] 
        public string Id { get; set; }
        [FirestoreProperty]
        public string? UserId { get; set; }
        [FirestoreProperty]
        public string? BookingId { get; set; }
        [FirestoreProperty]
        public double? Amount { get; set; }
        [FirestoreProperty] 
        public PaymentMethod Method { get; set; }
        [FirestoreProperty] 
        public PaymentStatus Status { get; set; }
        [FirestoreProperty] 
        public DateTime CreatedAt { get; set; }

        public Payment ToDomain(Booking? booking) => new Payment(Id, booking, Amount, Method, Status, CreatedAt);

        public static PaymentEntity FromDomain(Payment payment) => new PaymentEntity
        {
            Id = payment.Id ?? Guid.NewGuid().ToString(),
            UserId = payment.Booking?.User?.Id,
            BookingId = payment.Booking?.Id,
            Amount = payment.Amount,
            Method = payment.Method ?? PaymentMethod.Visa,
            Status = payment.Status ?? PaymentStatus.Pending,
            CreatedAt = payment.CreatedAt ?? DateTime.UtcNow,
        };
    }
}
