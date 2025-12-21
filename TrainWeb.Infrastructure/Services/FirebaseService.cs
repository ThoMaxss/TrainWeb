using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace TrainWeb.Infrastructure.Services
{
    public class FirebaseService
    {
        public FirebaseService(IConfiguration configuration)
        {
            var serviceAccountPath = configuration["Firebase:ServiceAccountPath"];
            if (string.IsNullOrWhiteSpace(serviceAccountPath))
                throw new InvalidOperationException("Missing config: Firebase:ServiceAccountPath");

            if (FirebaseApp.DefaultInstance == null)
            {
                FirebaseApp.Create(new AppOptions
                {
                    Credential = GoogleCredential.FromFile(serviceAccountPath)
                });
            }
        }

        public async Task<FirebaseToken?> VerifyIdTokenAsync(string idToken)
        {
            try
            {
                return await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token verification failed: {ex.Message}");
                return null;
            }
        }

        public Task<UserRecord> GetUserAsync(string uid)
            => FirebaseAuth.DefaultInstance.GetUserAsync(uid);

        public async Task<string?> CreateUserAsync(string email, string password)
        {
            try
            {
                var userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(new UserRecordArgs
                {
                    Email = email,
                    Password = password
                });
                return userRecord.Uid;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating user: {ex.Message}");
                return null;
            }
        }
    }
}
