using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Enum;

using Google.Cloud.Firestore;
using System.Xml.Linq;
using TrainWeb.Domain.Domain;
using System.Net.Sockets;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class TicketTypeEntity
    {
        [FirestoreProperty]
        public string Id { get; set; }
        [FirestoreProperty] 
        public string? Name { get; set; }
        [FirestoreProperty]
        public double Discount { get; set; }

        public TicketType ToDomain() => new TicketType(Id, Name, Discount);

        public static TicketTypeEntity FromDomain(TicketType ticketType) => new TicketTypeEntity
        {
            Id = ticketType.Id ?? Guid.NewGuid().ToString(),
            Name = ticketType.Name,
            Discount = ticketType.Discount ?? 0,
        };
    }
}
