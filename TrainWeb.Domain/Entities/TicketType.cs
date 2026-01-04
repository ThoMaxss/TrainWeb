using System;
using System.Collections.Generic;

namespace TrainWeb.Domain.Entities
{
    public class TicketType
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string DiscountPercentage { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int DisplayOrder { get; set; }

        // Navigation properties
        public virtual ICollection<Ticket>? Tickets { get; set; }

        public TicketType()
        {
            Id = Guid.NewGuid().ToString();
            CreatedAt = DateTime.UtcNow;
            IsActive = true;
            Tickets = new List<Ticket>();
        }
    }
}
