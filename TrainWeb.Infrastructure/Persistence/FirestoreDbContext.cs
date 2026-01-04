using Google.Cloud.Firestore;

namespace TrainWeb.Infrastructure.Persistence
{
    public class FirestoreDbContext
    {
        public FirestoreDb Db { get; }

        public FirestoreDbContext(string projectId, string credentialPath)
        {
            if (string.IsNullOrWhiteSpace(credentialPath) || !File.Exists(credentialPath))
            {
                throw new FileNotFoundException($"Firestore credential file not found at '{credentialPath}'. Ensure the path is correct and file exists.", credentialPath);
            }

            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialPath);
            Db = FirestoreDb.Create(projectId);
        }
    }
}
