using Google.Cloud.Firestore;
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
        public string Name { get; set; }
        [FirestoreProperty] 
        public string Email { get; set; }
        [FirestoreProperty] 
        public UserRole Role { get; set; }
        [FirestoreProperty] 
        public DateTime CreatedAt { get; set; }
        [FirestoreProperty]
        public string PasswordHash { get; set; } = string.Empty;

        public User ToDomain() => new User(
            Id,
            Name,
            Email,
            Role,
            CreatedAt
        );

        public static UserEntity FromDomain(User user)
        {
            return new UserEntity
            {
                Id = user.Id ?? Guid.NewGuid().ToString(),
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = user.Role ?? UserRole.Passenger,
                CreatedAt = DateTime.UtcNow,
            };
        }
    }
}
