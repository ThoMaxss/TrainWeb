using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Google.Cloud.Firestore;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class NotificationEntity
    {
        [FirestoreProperty] 
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [FirestoreProperty] 
        public string UserId { get; set; } = string.Empty;

        [FirestoreProperty] 
        public string Message { get; set; } = string.Empty;

        [FirestoreProperty] 
        public string Type { get; set; } = string.Empty;

        [FirestoreProperty] 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

