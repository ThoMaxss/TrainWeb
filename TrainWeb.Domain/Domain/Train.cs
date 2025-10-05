using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrainWeb.Domain.Domain
{
    public class Train
    {
        public string? Id { get; }
        public string? Name { get; }
        public string? Type { get; }

        public Train(string? id, string? name, string? type)
        {
            Id = id;
            Name = name;
            Type = type;
        }
    }
}
