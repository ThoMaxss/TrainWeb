using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public sealed class PaymentDto
    {
        public string? Id { get; set; }
        public BookingDto? Booking { get; set; }
        public double? Amount { get; set; }
        public PaymentMethod? Method { get; set; }
        public PaymentStatus? Status { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
