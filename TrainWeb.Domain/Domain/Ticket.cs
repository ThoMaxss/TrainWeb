using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Domain
{
    public class Ticket
    {
        public string? Id { get; }
        public Seat? Seat { get; }
        public TicketType? TicketType { get; }
        public TicketStatus? Status { get; set; }

        public Ticket(string? id, Seat? seat, TicketType? ticketType, TicketStatus? status)
        {
            Id = id;
            Seat = seat;
            TicketType = ticketType;
            Status = status;
        }
    }
}
