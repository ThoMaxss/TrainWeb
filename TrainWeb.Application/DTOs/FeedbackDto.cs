namespace TrainWeb.Application.DTOs
{
    public class FeedbackDto
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
        public bool IsPublished { get; set; }
        public DateTime? RespondedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation DTOs
        public UserDto? User { get; set; }
        public TripDto? Trip { get; set; }
    }

    public class CreateFeedbackDto
    {
        public string UserId { get; set; }
        public string? TripId { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; }
    }
}
