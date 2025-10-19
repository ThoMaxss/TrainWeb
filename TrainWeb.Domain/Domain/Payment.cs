using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Domain.Domain
{
    public class Payment
    {
        public string? Id { get; }
        public Booking? Booking { get; }
        public double? Amount { get; set; }
        public PaymentMethod? Method { get; }
        public PaymentStatus? Status { get; set; }
        public DateTime? CreatedAt { get; }

        public Payment(string? id, Booking? booking, double? amount,PaymentMethod? method, PaymentStatus? status, DateTime? createdAt)
        {
            Id = id;
            Booking = booking;
            Amount = amount;
            Method = method;
            Status = status;
            CreatedAt = createdAt;
        }
    }
}
