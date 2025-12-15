using FirebaseAdmin.Auth;
using System;
using System.Threading.Tasks;

namespace TrainWeb.Infrastructure.Services
{
    public class FirebaseAuthService
    {
        public async Task<string?> RegisterUserAsync(string email, string password)
        {
            try
            {
                var userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(new UserRecordArgs()
                {
                    Email = email,
                    Password = password
                });

                Console.WriteLine("User created successfully, verification email sent to the user.");

                return userRecord.Uid;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error registering user: {ex.Message}");
                return null;
            }
        }
    }
}
