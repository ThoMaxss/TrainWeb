using System;
using TrainWeb.Application.DTOS;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.Extensions
{
    public static class BookingDtoExtension
    {
        public static BookingDto ToDto(this Booking b) => new BookingDto
        {
            Id = b.Id,
            UserId = b.UserId,
            TripId = b.TripId,
            SeatId = b.SeatId,
            TicketTypeId = b.TicketTypeId, 
            Amount = b.Amount,
            Status = b.Status,
            PaymentStatus = b.PaymentStatus,
            PaymentId = b.PaymentId,
            TicketId = b.TicketId,
            TicketStatus = b.TicketStatus,
            CreatedAt = b.CreatedAt,
            ExpiresAt = b.ExpiresAt,
            SeatSummary = b.SeatSummary,
            TripSummary = b.TripSummary
        };

        public static Booking FromDto(this BookingDto d) => new Booking(
            id: d.Id,
            userId: d.UserId ?? throw new ArgumentException("UserId is required"),
            tripId: d.TripId ?? throw new ArgumentException("TripId is required"),
            seatId: d.SeatId ?? throw new ArgumentException("SeatId is required"),
            ticketTypeId: d.TicketTypeId,                     
            amount: d.Amount ?? 0,                             
            status: d.Status ?? BookingStatus.Reserved,
            paymentStatus: d.PaymentStatus ?? PaymentStatus.Pending,
            paymentId: d.PaymentId,
            ticketId: d.TicketId,
            ticketStatus: d.TicketStatus,
            createdAt: d.CreatedAt ?? DateTime.UtcNow,
            expiresAt: d.ExpiresAt
        )
        {
            SeatSummary = d.SeatSummary,
            TripSummary = d.TripSummary
        };
    }
}
