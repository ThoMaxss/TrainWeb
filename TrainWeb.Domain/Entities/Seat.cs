using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google.Cloud.Firestore;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class Seat
    {
        [FirestoreProperty] 
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [FirestoreProperty] 
        public string TripId { get; set; } = string.Empty;
        [FirestoreProperty] 
        public string SeatNumber { get; set; } = string.Empty;
        [FirestoreProperty] 
        public string Type { get; set; } = string.Empty;
        [FirestoreProperty] 
        public bool IsAvailable { get; set; } = true;
        [FirestoreProperty] 
        public double Price { get; set; }
    }
}
