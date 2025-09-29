using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Enum;

using Google.Cloud.Firestore;

namespace TrainWeb.Domain.Entities
{
    [FirestoreData]
    public class Ticket
    {
        [FirestoreProperty]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [FirestoreProperty] 
        public string BookingId { get; set; } = string.Empty;
        [FirestoreProperty] 
        public string QrCode { get; set; } = string.Empty;
        [FirestoreProperty] 
        public TicketStatus Status { get; set; } = TicketStatus.Active;
    }
}
