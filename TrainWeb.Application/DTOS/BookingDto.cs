using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public class BookingDto
    {
        public string? Id { get; set; }

        public UserDto? User { get; set; }

        public TripDto? Trip { get; set; }

        public SeatDto? Seat { get; set; }

        public TicketDto? Ticket { get; set; }

        public double? Price { get; set; }

        public BookingStatus? Status { get; set; }

        public DateTime? CreatedAt { get; set; }

    }
}

