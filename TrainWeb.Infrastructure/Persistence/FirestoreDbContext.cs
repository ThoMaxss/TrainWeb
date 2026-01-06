using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;

namespace TrainWeb.Infrastructure.Persistence
{
    public class FirestoreDbContext
    {
        public FirestoreDb Db { get; }

        public FirestoreDbContext(string projectId, string credentialPath)
        {
            if (string.IsNullOrWhiteSpace(credentialPath) || !File.Exists(credentialPath))
                throw new FileNotFoundException($"Credential not found: {credentialPath}", credentialPath);

            var credential = GoogleCredential.FromFile(credentialPath);

            var client = new FirestoreClientBuilder
            {
                Credential = credential
            }.Build();

            Db = FirestoreDb.Create(projectId, client);
        }
    }
}
