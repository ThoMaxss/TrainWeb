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

        // Firestore đang lưu lowercase: "passenger" | "staff" | "admin"
        [FirestoreProperty("role")]
        public string Role { get; set; } = "passenger";

        [FirestoreProperty("createdAt")]
        public Timestamp CreatedAt { get; set; } = Timestamp.GetCurrentTimestamp();

        [FirestoreProperty("isEmailVerified")]
        public bool IsEmailVerified { get; set; } = false;

        [FirestoreProperty("CCCD")]
        public string CCCD { get; set; } = string.Empty;

        [FirestoreProperty("phone")]
        public string Phone { get; set; } = string.Empty;

        [FirestoreProperty("avatarURL")]
        public string AvatarURL { get; set; } = string.Empty;

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
                isEmailVerified: IsEmailVerified,
                cccd: string.IsNullOrWhiteSpace(CCCD) ? null : CCCD,
                phone: string.IsNullOrWhiteSpace(Phone) ? null : Phone,
                avatarURL: string.IsNullOrWhiteSpace(AvatarURL) ? null : AvatarURL
            );
        }

        public static UserEntity FromDomain(User user)
        {
            if (string.IsNullOrWhiteSpace(user.Id))
                throw new ArgumentException("User.Id (Firebase UID) is required.");

            return new UserEntity
            {
                Id = user.Id,
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = (user.Role ?? UserRole.Passenger).ToString().ToLowerInvariant(),
                CreatedAt = user.CreatedAt.HasValue
                    ? Timestamp.FromDateTime(DateTime.SpecifyKind(user.CreatedAt.Value, DateTimeKind.Utc))
                    : Timestamp.GetCurrentTimestamp(),
                IsEmailVerified = user.IsEmailVerified ?? false,

                CCCD = user.CCCD ?? string.Empty,
                Phone = user.Phone ?? string.Empty,
                AvatarURL = user.AvatarURL ?? string.Empty
            };
        }
    }
}
