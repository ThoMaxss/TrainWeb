using System;

namespace TrainWeb.Domain.Entities
{
    public class Feedback
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string? TripId { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; } // 1-5
        public string Status { get; set; } // Pending, Responded, Resolved
        public string? ResponseMessage { get; set; }
        public string? RespondedByUserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? RespondedAt { get; set; }
        public bool IsPublished { get; set; }

        // Navigation properties
        public virtual User? User { get; set; }
        public virtual Trip? Trip { get; set; }

        public Feedback()
        {
            Id = Guid.NewGuid().ToString();
            CreatedAt = DateTime.UtcNow;
            Status = "Pending";
            IsPublished = false;
        }
    }
}
