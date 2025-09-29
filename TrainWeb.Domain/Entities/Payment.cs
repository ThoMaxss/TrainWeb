using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class Payment
    {
        [FirestoreProperty] public string Id { get; set; } = Guid.NewGuid().ToString();
        [FirestoreProperty] public string BookingId { get; set; } = string.Empty;
        [FirestoreProperty] public double Amount { get; set; }
        [FirestoreProperty] public PaymentMethod Method { get; set; } = PaymentMethod.Visa;
        [FirestoreProperty] public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        [FirestoreProperty] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
