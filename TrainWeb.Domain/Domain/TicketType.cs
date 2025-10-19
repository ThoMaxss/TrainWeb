using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Domain
{
    public class TicketType
    {
        public string? Id { get; }
        public string? Name { get; }
        public double? Discount { get; }

        public TicketType(string? id, string? name, double? discount)
        {
            Id = id;
            Name = name;
            Discount = discount;
        }
    }
}
