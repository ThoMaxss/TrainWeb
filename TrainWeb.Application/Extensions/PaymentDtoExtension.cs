using System;
using TrainWeb.Application.Extensions;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.Application.DTOS
{
    public static class PaymentDtoExtension
    {
        public static PaymentDto ToDto(this Payment p) => new PaymentDto
        {
            Id = p.Id,
            Booking = p.Booking?.ToDto(),
            Amount = p.Amount,
            Method = p.Method,
            Status = p.Status,
            CreatedAt = p.CreatedAt
        };

        public static Payment FromDto(this PaymentDto d)
        {
            if (d == null) throw new ArgumentNullException(nameof(d));

            var booking = d.Booking?.FromDto();
            var bookingId = !string.IsNullOrWhiteSpace(d.BookingId) ? d.BookingId : booking?.Id;

            return new Payment(
                id: d.Id,
                booking: booking,
                bookingId: bookingId,
                amount: d.Amount ?? 0d,
                method: d.Method ?? PaymentMethod.Visa,
                status: d.Status ?? PaymentStatus.Pending,
                createdAt: d.CreatedAt ?? DateTime.UtcNow
            );
        }
    }
}
