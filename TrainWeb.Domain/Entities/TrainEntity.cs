using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Google.Cloud.Firestore;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class TrainEntity
    {
        [FirestoreProperty] 
        public string Id { get; set; }
        [FirestoreProperty] 
        public string Name { get; set; }
        [FirestoreProperty] 
        public string Type { get; set; }

        public Train ToDomain() => new Train(Id, Name, Type);

        public static TrainEntity FromDomain(Train train) => new TrainEntity
        {
            Id = train.Id ?? Guid.NewGuid().ToString(),
            Name = train.Name,
            Type = train.Type,
        };
    }
}

