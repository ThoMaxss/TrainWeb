using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Google.Cloud.Firestore;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class Train
    {
        [FirestoreProperty] 
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [FirestoreProperty] 
        public string Name { get; set; } = string.Empty;
        [FirestoreProperty] 
        public string Type { get; set; } = string.Empty;
    }
}

