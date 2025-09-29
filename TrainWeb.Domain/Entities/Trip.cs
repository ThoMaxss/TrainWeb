using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrainWeb.Domain.Entities
{
    using Google.Cloud.Firestore;

    namespace TrainWeb.Domain.Entities
    {
        [FirestoreData]
        public class Trip
        {
            [FirestoreProperty] 
            public string Id { get; set; } = Guid.NewGuid().ToString();
            [FirestoreProperty] 
            public string TrainId { get; set; } = string.Empty;
            [FirestoreProperty] 
            public DateTime Departure { get; set; }
            [FirestoreProperty] 
            public DateTime Arrival { get; set; }
            [FirestoreProperty] 
            public string OriginStation { get; set; } = string.Empty;
            [FirestoreProperty] 
            public string DestinationStation { get; set; } = string.Empty;
            [FirestoreProperty] 
            public int SeatsAvailable { get; set; }
        }
    }

}
