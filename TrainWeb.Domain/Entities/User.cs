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
    public class User
    {
        [FirestoreProperty] 
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [FirestoreProperty] 
        public string Name { get; set; } = string.Empty;
        [FirestoreProperty] 
        public string Email { get; set; } = string.Empty;
        [FirestoreProperty] 
        public UserRole Role { get; set; } = UserRole.Passenger;
        [FirestoreProperty] 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
