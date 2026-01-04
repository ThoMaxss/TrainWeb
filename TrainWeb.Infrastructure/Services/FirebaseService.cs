using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

namespace TrainWeb.Infrastructure.Services
{
    public class FirebaseService
    {
        private readonly bool _isDevFallback;

        public sealed class DecodedToken
        {
            public string Uid { get; set; } = string.Empty;
            public IReadOnlyDictionary<string, object>? Claims { get; set; }
        }
        public FirebaseService(IConfiguration configuration)
        {
            var serviceAccountPath = configuration["Firebase:ServiceAccountPath"];

            // Resolve relative paths against the app base directory
            var baseDir = AppContext.BaseDirectory ?? Directory.GetCurrentDirectory();
            string resolvedPath = string.IsNullOrWhiteSpace(serviceAccountPath)
                ? Path.Combine(baseDir, "firebase-key.json")
                : Path.IsPathRooted(serviceAccountPath)
                    ? serviceAccountPath
                    : Path.Combine(baseDir, serviceAccountPath);

            if (!File.Exists(resolvedPath))
            {
                // Development fallback: allow running without a service account file by accepting "dev:<uid>" tokens
                var env = configuration["ASPNETCORE_ENVIRONMENT"] ?? "Production";
                if (env.Equals("Development", StringComparison.OrdinalIgnoreCase))
                {
                    Console.WriteLine($"Warning: firebase-key.json not found at '{resolvedPath}'. Enabling development token fallback.");
                    _isDevFallback = true;
                }
                else
                {
                    throw new FileNotFoundException($"Firebase service account file not found at '{resolvedPath}'. " +
                        "Set 'Firebase:ServiceAccountPath' in configuration or place 'firebase-key.json' in the application content root.", resolvedPath);
                }
            }
            else
            {
                if (FirebaseApp.DefaultInstance == null)
                {
                    FirebaseApp.Create(new AppOptions
                    {
                        Credential = GoogleCredential.FromFile(resolvedPath)
                    });
                }
            }
        }

        /// <summary>
        /// Verify id token. In production this delegates to Firebase Admin SDK and returns a <see cref="FirebaseToken"/>-like object.
        /// In development fallback mode (when no service account file), it accepts tokens of the form "dev:{uid}" or raw uid strings.
        /// </summary>
        public async Task<DecodedToken?> VerifyIdTokenAsync(string idToken)
        {
            if (string.IsNullOrWhiteSpace(idToken)) return null;

            if (_isDevFallback)
            {
                // Accept simple development tokens: "dev:<uid>" or just a uid
                var uid = idToken.StartsWith("dev:", StringComparison.OrdinalIgnoreCase)
                    ? idToken[4..]
                    : idToken;

                var claims = new Dictionary<string, object>
                {
                    { "email", $"{uid}@dev.local" },
                    { "email_verified", true }
                };

                return await Task.FromResult(new DecodedToken { Uid = uid, Claims = claims });
            }

            try
            {
                var decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);

                return new DecodedToken
                {
                    Uid = decoded.Uid,
                    Claims = decoded.Claims
                };
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
