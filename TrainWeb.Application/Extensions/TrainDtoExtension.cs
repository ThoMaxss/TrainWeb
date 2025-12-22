using System;
using TrainWeb.Domain.Domain;

namespace TrainWeb.Application.DTOS
{
    public static class TrainDtoExtension
    {
        public static TrainDto ToDto(this Train t) => new TrainDto
        {
            Id = t.Id,
            Name = t.Name,
            Type = t.Type,
            CreatedAt = t.CreatedAt
        };

        public static Train FromDto(this TrainDto d)
        {
            if (d == null) throw new ArgumentNullException(nameof(d));

            if (string.IsNullOrWhiteSpace(d.Name))
                throw new ArgumentException("Train Name is required", nameof(d.Name));

            if (string.IsNullOrWhiteSpace(d.Type))
                throw new ArgumentException("Train Type is required", nameof(d.Type));

            return new Train(
                id: d.Id?.Trim() ?? "",                  
                name: d.Name.Trim(),
                type: d.Type.Trim(),
                createdAt: d.CreatedAt ?? DateTime.UtcNow
            );
        }
    }
}
