using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Google.Cloud.Firestore;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class Feedback
    {
        [FirestoreProperty] 
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [FirestoreProperty] 
        public string UserId { get; set; } = string.Empty;

        [FirestoreProperty] 
        public string TripId { get; set; } = string.Empty;

        [FirestoreProperty] 
        string Content { get; set; } = string.Empty;

        [FirestoreProperty]
        public int Rating { get; set; }

        [FirestoreProperty] 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
