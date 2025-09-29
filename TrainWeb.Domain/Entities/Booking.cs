using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Google.Cloud.Firestore;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class Booking
    {
        [FirestoreProperty]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [FirestoreProperty]
        public string UserId { get; set; } = string.Empty;

        [FirestoreProperty]
        public string TripId { get; set; } = string.Empty;

        [FirestoreProperty]
        public string SeatId { get; set; } = string.Empty;

        public enum StatusEnum
        {
            Reversed,
            Paid,
            Cancelled
        }

        [FirestoreProperty]
        public StatusEnum Status { get; set; }

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
