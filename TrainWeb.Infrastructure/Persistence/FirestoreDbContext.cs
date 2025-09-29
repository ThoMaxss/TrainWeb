using Google.Cloud.Firestore;

namespace TrainWeb.Infrastructure.Persistence
{
    public class FirestoreDbContext
    {
        public FirestoreDb Db { get; }

        public FirestoreDbContext(string projectId, string credentialPath)
        {
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialPath);
            Db = FirestoreDb.Create(projectId);
        }
    }
}
