using Google.Cloud.Firestore;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class UserEntity
    {
        [FirestoreProperty]
        public required string Id { get; set; }

        [FirestoreProperty]
        public required string Name { get; set; }

        [FirestoreProperty]
        public required string Email { get; set; }

        [FirestoreProperty]
        public UserRole Role { get; set; }

        [FirestoreProperty]
        public DateTime CreatedAt { get; set; }

        [FirestoreProperty]
        public string PasswordHash { get; set; } = string.Empty;

        [FirestoreProperty]
        public bool IsEmailVerified { get; set; } = false;

        public User ToDomain() => new User(
            Id,
            Name,
            Email,
            Role,
            CreatedAt,
            IsEmailVerified 
        );

        public static UserEntity FromDomain(User user)
        {
            return new UserEntity
            {
                Id = user.Id ?? Guid.NewGuid().ToString(),
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = user.Role ?? UserRole.Passenger,
                CreatedAt = user.CreatedAt ?? DateTime.UtcNow,
                IsEmailVerified = user.IsEmailVerified ?? false, 
                PasswordHash = string.Empty 
            };
        }
    }
}