using System;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public static class TicketDtoExtension
    {
        public static TicketDto ToDto(this Ticket t) => new TicketDto
        {
            Id = t.Id,
            BookingId = t.BookingId,
            TicketNumber = t.TicketNumber,
            QrCode = t.QrCode,
            Status = t.Status,
            CreatedAt = t.CreatedAt,
            ActiveAt = t.ActiveAt
        };

        public static Ticket FromDto(this TicketDto d)
        {
            if (d == null) throw new ArgumentNullException(nameof(d));

            if (string.IsNullOrWhiteSpace(d.BookingId))
                throw new ArgumentException("BookingId is required", nameof(d.BookingId));

            var ticketNumber = d.TicketNumber ?? string.Empty;
            var qrCode = d.QrCode ?? string.Empty;

            return new Ticket(
                id: d.Id,
                bookingId: d.BookingId,
                ticketNumber: ticketNumber,
                qrCode: qrCode,
                status: d.Status ?? TicketStatus.Active,
                createdAt: d.CreatedAt ?? DateTime.UtcNow,
                activeAt: d.ActiveAt
            );
        }
    }
}
