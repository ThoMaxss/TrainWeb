using System;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Application.DTOS
{
    public static class TicketTypeDtoExtension
    {
        public static TicketTypeDto ToDto(this TicketType t) => new TicketTypeDto
        {
            Id = t.Id,
            Name = t.Name,
            DiscountPercent = t.Discount * 100.0
        };

        public static TicketType FromDto(this TicketTypeDto d)
        {
            if (d == null) throw new ArgumentNullException(nameof(d));

            if (string.IsNullOrWhiteSpace(d.Id))
                throw new ArgumentException("TicketType Id is required", nameof(d.Id));

            if (string.IsNullOrWhiteSpace(d.Name))
                throw new ArgumentException("TicketType Name is required", nameof(d.Name));

            if (d.DiscountPercent < 0 || d.DiscountPercent > 100)
                throw new ArgumentException("DiscountPercent must be between 0 and 100", nameof(d.DiscountPercent));

            var discount = d.DiscountPercent / 100.0; 

            return new TicketType(
                id: d.Id.Trim(),
                name: d.Name.Trim(),
                discount: discount
            );
        }
    }
}
