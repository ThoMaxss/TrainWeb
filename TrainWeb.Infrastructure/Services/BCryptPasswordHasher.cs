using BCrypt.Net;

namespace TrainWeb.Infrastructure.Services
{
    public class BCryptPasswordHasher
    {
        public string HashPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Password cannot be empty");

            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password, string hashedPassword)
        {
            if (string.IsNullOrWhiteSpace(hashedPassword))
                throw new ArgumentException("Hashed password cannot be null or empty");

            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}
