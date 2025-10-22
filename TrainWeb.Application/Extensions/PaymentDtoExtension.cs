using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Application.Extensions;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Application.DTOS
{
    public static class PaymentDtoExtension
    {
        public static PaymentDto ToDto(this Payment @this) => new PaymentDto
        {
            Id = @this.Id,
            Booking = @this.Booking.ToDto(),
            Amount = @this.Amount,
            Method = @this.Method,
            Status = @this.Status,
            CreatedAt = @this.CreatedAt
        };

        public static Payment FromDto(this PaymentDto @this) => new Payment(
            @this.Id,
            @this.Booking?.FromDto(),
            null,
            @this.Method,
            @this.Status,
            @this.CreatedAt
        );
    }
}
