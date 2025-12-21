using Google.Cloud.Firestore;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class UserEntity
    {
        [FirestoreDocumentId]
        public string Id { get; set; } = default!;

        [FirestoreProperty("name")]
        public string Name { get; set; } = string.Empty;

        [FirestoreProperty("email")]
        public string Email { get; set; } = string.Empty;

        [FirestoreProperty("role")]
        public string Role { get; set; } = "passenger";

        [FirestoreProperty("createdAt")]
        public Timestamp CreatedAt { get; set; } = Timestamp.GetCurrentTimestamp();

        public User ToDomain()
        {
            var roleEnum = System.Enum.TryParse<UserRole>(Role, ignoreCase: true, out var r)
                ? r
                : UserRole.Passenger;

            return new User(
                id: Id,
                name: Name,
                email: Email,
                role: roleEnum,
                createdAt: CreatedAt.ToDateTime(),
                isEmailVerified: null 
            );
        }

        public static UserEntity FromDomain(User user)
        {
            return new UserEntity
            {
                Id = user.Id ?? Guid.NewGuid().ToString(),
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = (user.Role ?? UserRole.Passenger).ToString().ToLower(),
                CreatedAt = user.CreatedAt.HasValue
                    ? Timestamp.FromDateTime(DateTime.SpecifyKind(user.CreatedAt.Value, DateTimeKind.Utc))
                    : Timestamp.GetCurrentTimestamp()
            };
        }
    }
}
