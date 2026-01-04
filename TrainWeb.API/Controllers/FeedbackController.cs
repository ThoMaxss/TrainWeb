using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainWeb.Application.DTOs;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Data;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FeedbackController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FeedbackController> _logger;

        public FeedbackController(ApplicationDbContext context, ILogger<FeedbackController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Create feedback
        /// </summary>
        [HttpPost("create")]
        public async Task<ActionResult<FeedbackDto>> CreateFeedback([FromBody] CreateFeedbackRequest request)
        {
            try
            {
                // Validate user exists
                var user = await _context.Users.FindAsync(request.UserId);
                if (user == null)
                {
                    return BadRequest(new { error = "User not found" });
                }

                // Validate rating range
                if (request.Rating < 1 || request.Rating > 5)
                {
                    return BadRequest(new { error = "Rating must be between 1 and 5" });
                }

                // Validate trip if provided
                if (!string.IsNullOrEmpty(request.TripId))
                {
                    var trip = await _context.Trips.FindAsync(request.TripId);
                    if (trip == null)
                    {
                        return BadRequest(new { error = "Trip not found" });
                    }
                }

                var feedback = new Feedback
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = request.UserId,
                    TripId = request.TripId,
                    Subject = request.Subject,
                    Content = request.Content,
                    Rating = request.Rating,
                    Status = "Pending",
                    IsPublished = false,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Feedbacks.Add(feedback);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Feedback {FeedbackId} created by user {UserId}", feedback.Id, request.UserId);

                return CreatedAtAction(nameof(GetFeedback), new { feedbackId = feedback.Id }, new FeedbackDto
                {
                    Id = feedback.Id,
                    UserId = feedback.UserId,
                    Subject = feedback.Subject,
                    Content = feedback.Content,
                    Rating = feedback.Rating,
                    Status = feedback.Status,
                    CreatedAt = feedback.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating feedback");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get all feedback (paginated, admin only)
        /// </summary>
        [HttpGet("all")]
        public async Task<ActionResult<object>> GetAllFeedback([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var totalCount = await _context.Feedbacks.CountAsync();
                var feedbacks = await _context.Feedbacks
                    .Include(f => f.User)
                    .OrderByDescending(f => f.CreatedAt)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = feedbacks.Select(f => new FeedbackDto
                {
                    Id = f.Id,
                    UserId = f.UserId,
                    Subject = f.Subject,
                    Content = f.Content,
                    Rating = f.Rating,
                    Status = f.Status,
                    ResponseMessage = f.ResponseMessage,
                    RespondedAt = f.RespondedAt,
                    IsPublished = f.IsPublished,
                    CreatedAt = f.CreatedAt
                }).ToList();

                return Ok(new
                {
                    data = result,
                    pagination = new
                    {
                        pageNumber,
                        pageSize,
                        totalCount,
                        totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize)
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all feedback");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get user's feedback
        /// </summary>
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<FeedbackDto>>> GetUserFeedback(string userId)
        {
            try
            {
                var feedbacks = await _context.Feedbacks
                    .Where(f => f.UserId == userId)
                    .OrderByDescending(f => f.CreatedAt)
                    .ToListAsync();

                var result = feedbacks.Select(f => new FeedbackDto
                {
                    Id = f.Id,
                    UserId = f.UserId,
                    Subject = f.Subject,
                    Content = f.Content,
                    Rating = f.Rating,
                    Status = f.Status,
                    CreatedAt = f.CreatedAt
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user feedback");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get single feedback
        /// </summary>
        [HttpGet("{feedbackId}")]
        [AllowAnonymous]
        public async Task<ActionResult<FeedbackDto>> GetFeedback(string feedbackId)
        {
            try
            {
                var feedback = await _context.Feedbacks
                    .Include(f => f.User)
                    .FirstOrDefaultAsync(f => f.Id == feedbackId);

                if (feedback == null)
                {
                    return NotFound(new { error = "Feedback not found" });
                }

                return Ok(new FeedbackDto
                {
                    Id = feedback.Id,
                    UserId = feedback.UserId,
                    Subject = feedback.Subject,
                    Content = feedback.Content,
                    Rating = feedback.Rating,
                    Status = feedback.Status,
                    ResponseMessage = feedback.ResponseMessage,
                    RespondedAt = feedback.RespondedAt,
                    IsPublished = feedback.IsPublished,
                    CreatedAt = feedback.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching feedback");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Respond to feedback (Admin only)
        /// </summary>
        [HttpPost("{feedbackId}/respond")]
        public async Task<ActionResult<object>> RespondToFeedback(string feedbackId, [FromBody] RespondFeedbackRequest request)
        {
            try
            {
                var feedback = await _context.Feedbacks.FindAsync(feedbackId);
                if (feedback == null)
                {
                    return NotFound(new { error = "Feedback not found" });
                }

                feedback.ResponseMessage = request.ResponseMessage;
                feedback.RespondedByUserId = request.RespondedByUserId;
                feedback.RespondedAt = DateTime.UtcNow;
                feedback.Status = "Responded";
                feedback.IsPublished = request.IsPublished;

                _context.Feedbacks.Update(feedback);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Response added to feedback {FeedbackId}", feedbackId);

                return Ok(new { 
                    message = "Response added successfully",
                    respondedAt = feedback.RespondedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error responding to feedback");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get published feedback (public)
        /// </summary>
        [HttpGet("published/list")]
        [AllowAnonymous]
        public async Task<ActionResult<List<FeedbackDto>>> GetPublishedFeedback([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
        {
            try
            {
                var feedbacks = await _context.Feedbacks
                    .Where(f => f.IsPublished && f.Status == "Responded")
                    .Include(f => f.User)
                    .OrderByDescending(f => f.Rating)
                    .ThenByDescending(f => f.CreatedAt)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = feedbacks.Select(f => new FeedbackDto
                {
                    Id = f.Id,
                    Subject = f.Subject,
                    Content = f.Content,
                    Rating = f.Rating,
                    ResponseMessage = f.ResponseMessage,
                    CreatedAt = f.CreatedAt,
                    RespondedAt = f.RespondedAt
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching published feedback");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
    }

    public class CreateFeedbackRequest
    {
        public string UserId { get; set; }
        public string? TripId { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; }
    }

    public class RespondFeedbackRequest
    {
        public string ResponseMessage { get; set; }
        public string RespondedByUserId { get; set; }
        public bool IsPublished { get; set; } = false;
    }
}
