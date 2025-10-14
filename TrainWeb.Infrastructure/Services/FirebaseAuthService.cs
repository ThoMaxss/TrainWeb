using FirebaseAdmin.Auth;
using System.Threading.Tasks;

namespace TrainWeb.Infrastructure.Services
{
    public class FirebaseAuthService
    {
        public async Task<FirebaseToken?> VerifyFirebaseTokenAsync(string idToken)
        {
            try
            {
                var decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
                return decoded;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token verification failed: {ex.Message}");
                return null;
            }
        }
    }
}
