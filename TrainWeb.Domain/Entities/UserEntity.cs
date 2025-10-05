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
    public class UserEntity
    {
        [FirestoreProperty] 
        public string Id { get; set; } 
        [FirestoreProperty] 
        public string Name { get; set; } = string.Empty;
        [FirestoreProperty] 
        public string Email { get; set; } = string.Empty;
        [FirestoreProperty] 
        public UserRole Role { get; set; } = UserRole.Passenger;
        [FirestoreProperty] 
        public DateTime CreatedAt { get; set; }

        public User ToDomain() => new User(
            Id,
            Name,
            Email,
            Role,
            CreatedAt
        );

        public static UserEntity FromDomain(User user) => new UserEntity
        {
            Id = user.Id ?? Guid.NewGuid().ToString(),
            Name = user.Name,
            Email = user.Email,
            Role = user.Role ?? UserRole.Passenger,
            CreatedAt = DateTime.UtcNow,
        };
    }
}
