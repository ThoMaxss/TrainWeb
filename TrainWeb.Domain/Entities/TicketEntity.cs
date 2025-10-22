using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Enum;

using Google.Cloud.Firestore;
using System.Xml.Linq;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class TicketEntity
    {
        [FirestoreProperty]
        public string Id { get; set; }
        [FirestoreProperty] 
        public string? SeatId { get; set; }
        [FirestoreProperty]
        public string? TicketTypeId { get; set; }
        [FirestoreProperty]
        public TicketStatus Status { get; set; }

        public Ticket ToDomain(Seat? seat, TicketType? ticketType) => new Ticket(Id, seat, ticketType, Status);

        public static TicketEntity FromDomain(Ticket ticket) => new TicketEntity
        {
            Id = ticket.Id ?? Guid.NewGuid().ToString(),
            SeatId = ticket.Seat?.Id,
            TicketTypeId = ticket.TicketType?.Id,
            Status = ticket.Status ?? TicketStatus.Active
        };
    }
}
