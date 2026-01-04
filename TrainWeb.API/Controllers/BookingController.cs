using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainWeb.Application.DTOs;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enums;
using TrainWeb.Infrastructure.Data;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BookingController> _logger;

        public BookingController(ApplicationDbContext context, ILogger<BookingController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Create a new booking with seat availability validation
        /// </summary>
        [HttpPost("create")]
        public async Task<ActionResult<BookingDto>> CreateBooking([FromBody] CreateBookingRequest request)
        {
            try
            {
                _logger.LogInformation("Creating booking for user {UserId}, trip {TripId}", request.UserId, request.TripId);

                // 1. Validate trip exists and is active
                var trip = await _context.Trips
                    .Include(t => t.Train)
                    .FirstOrDefaultAsync(t => t.Id == request.TripId && t.IsActive);

                if (trip == null)
                {
                    _logger.LogWarning("Trip {TripId} not found or inactive", request.TripId);
                    return BadRequest(new { error = "Trip not found or is inactive" });
                }

                // 2. Validate trip date is in the future
                if (trip.TripDate.Date < DateTime.Now.Date)
                {
                    _logger.LogWarning("Trip {TripId} date is in the past", request.TripId);
                    return BadRequest(new { error = "Cannot book for past dates" });
                }

                // 3. Validate user exists
                var user = await _context.Users.FindAsync(request.UserId);
                if (user == null)
                {
                    _logger.LogWarning("User {UserId} not found", request.UserId);
                    return NotFound(new { error = "User not found" });
                }

                // 4. Check seat availability - CRITICAL VALIDATION
                var availableSeats = await _context.Seats
                    .Where(s => s.TripId == request.TripId && s.IsAvailable)
                    .ToListAsync();

                if (availableSeats.Count < request.NumberOfPassengers)
                {
                    _logger.LogWarning("Not enough seats available. Required: {Required}, Available: {Available}", 
                        request.NumberOfPassengers, availableSeats.Count);
                    return BadRequest(new { 
                        error = "Not enough seats available",
                        available = availableSeats.Count,
                        requested = request.NumberOfPassengers
                    });
                }

                // 5. Calculate price with discount if applicable
                var selectedSeats = availableSeats.Take(request.NumberOfPassengers).ToList();
                decimal totalPrice = selectedSeats.Sum(s => decimal.Parse(s.Price));
                decimal discountAmount = 0;

                // Apply ticket type discount if provided
                if (!string.IsNullOrEmpty(request.TicketTypeId))
                {
                    var ticketType = await _context.TicketTypes.FindAsync(request.TicketTypeId);
                    if (ticketType != null && ticketType.IsActive)
                    {
                        var discountPercent = decimal.Parse(ticketType.DiscountPercentage);
                        discountAmount = (totalPrice * discountPercent) / 100;
                        totalPrice -= discountAmount;
                        _logger.LogInformation("Applied discount {DiscountPercent}% for ticket type {TicketTypeId}", 
                            discountPercent, request.TicketTypeId);
                    }
                }

                // 6. Calculate tax (10%)
                decimal taxAmount = (totalPrice * 10) / 100;
                decimal finalAmount = totalPrice + taxAmount;

                // 7. Create booking within transaction
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        var booking = new Booking
                        {
                            Id = Guid.NewGuid().ToString(),
                            UserId = request.UserId,
                            TripId = request.TripId,
                            BookingReference = GenerateBookingReference(),
                            Status = BookingStatus.Pending,
                            NumberOfPassengers = request.NumberOfPassengers,
                            TotalPrice = totalPrice.ToString("F2"),
                            DiscountAmount = discountAmount.ToString("F2"),
                            TaxAmount = taxAmount.ToString("F2"),
                            FinalAmount = finalAmount.ToString("F2"),
                            CreatedAt = DateTime.UtcNow,
                            Notes = request.Notes
                        };

                        _context.Bookings.Add(booking);

                        // 8. Mark selected seats as booked
                        foreach (var seat in selectedSeats)
                        {
                            seat.IsAvailable = false;
                            seat.BookedByUserId = request.UserId;
                            seat.BookedAt = DateTime.UtcNow;
                            seat.BookingReference = booking.BookingReference;
                            _context.Seats.Update(seat);
                        }

                        // 9. Update trip available seats count
                        trip.SeatsAvailable -= request.NumberOfPassengers;
                        _context.Trips.Update(trip);

                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        _logger.LogInformation("Booking {BookingReference} created successfully", booking.BookingReference);

                        return Ok(new BookingDto
                        {
                            Id = booking.Id,
                            BookingReference = booking.BookingReference,
                            UserId = booking.UserId,
                            TripId = booking.TripId,
                            NumberOfPassengers = booking.NumberOfPassengers,
                            TotalPrice = booking.TotalPrice,
                            DiscountAmount = booking.DiscountAmount,
                            TaxAmount = booking.TaxAmount,
                            FinalAmount = booking.FinalAmount,
                            Status = booking.Status.ToString(),
                            CreatedAt = booking.CreatedAt
                        });
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        _logger.LogError(ex, "Error creating booking");
                        throw;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in CreateBooking");
                return StatusCode(500, new { error = "Internal server error", details = ex.Message });
            }
        }

        /// <summary>
        /// Get user's bookings
        /// </summary>
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<BookingDto>>> GetUserBookings(string userId)
        {
            try
            {
                var bookings = await _context.Bookings
                    .Where(b => b.UserId == userId)
                    .Include(b => b.Trip)
                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();

                if (bookings.Count == 0)
                {
                    return Ok(new List<BookingDto>());
                }

                var result = bookings.Select(b => new BookingDto
                {
                    Id = b.Id,
                    BookingReference = b.BookingReference,
                    UserId = b.UserId,
                    TripId = b.TripId,
                    NumberOfPassengers = b.NumberOfPassengers,
                    TotalPrice = b.TotalPrice,
                    DiscountAmount = b.DiscountAmount,
                    TaxAmount = b.TaxAmount,
                    FinalAmount = b.FinalAmount,
                    Status = b.Status.ToString(),
                    CreatedAt = b.CreatedAt,
                    PaidAt = b.PaidAt
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user bookings");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get booking details
        /// </summary>
        [HttpGet("{bookingId}")]
        public async Task<ActionResult<BookingDto>> GetBooking(string bookingId)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.Trip)
                    .FirstOrDefaultAsync(b => b.Id == bookingId);

                if (booking == null)
                {
                    return NotFound(new { error = "Booking not found" });
                }

                return Ok(new BookingDto
                {
                    Id = booking.Id,
                    BookingReference = booking.BookingReference,
                    UserId = booking.UserId,
                    TripId = booking.TripId,
                    NumberOfPassengers = booking.NumberOfPassengers,
                            TotalPrice = booking.TotalPrice,
                            DiscountAmount = booking.DiscountAmount,
                            TaxAmount = booking.TaxAmount,
                            FinalAmount = booking.FinalAmount,
                    Status = booking.Status.ToString(),
                    CreatedAt = booking.CreatedAt,
                    PaidAt = booking.PaidAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching booking");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Cancel booking with refund calculation
        /// </summary>
        [HttpPost("{bookingId}/cancel")]
        public async Task<ActionResult<object>> CancelBooking(string bookingId, [FromBody] CancelBookingRequest request)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.Trip)
                    .FirstOrDefaultAsync(b => b.Id == bookingId);

                if (booking == null)
                {
                    return NotFound(new { error = "Booking not found" });
                }

                if (booking.Status == BookingStatus.Cancelled)
                {
                    return BadRequest(new { error = "Booking is already cancelled" });
                }

                if (booking.Status == BookingStatus.Completed)
                {
                    return BadRequest(new { error = "Cannot cancel completed bookings" });
                }

                // Calculate refund based on cancellation timing
                decimal refundAmount = CalculateRefund(booking);

                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        // Update booking status
                        booking.Status = BookingStatus.Cancelled;
                        booking.CancelledAt = DateTime.UtcNow;
                        booking.CancellationReason = request.CancellationReason;
                        _context.Bookings.Update(booking);

                        // Release booked seats
                        var bookedSeats = await _context.Seats
                            .Where(s => s.BookingReference == booking.BookingReference)
                            .ToListAsync();

                        foreach (var seat in bookedSeats)
                        {
                            seat.IsAvailable = true;
                            seat.BookedByUserId = null;
                            seat.BookedAt = null;
                            seat.BookingReference = null;
                            _context.Seats.Update(seat);
                        }

                        // Update trip available seats
                        booking.Trip.SeatsAvailable += booking.NumberOfPassengers;
                        _context.Trips.Update(booking.Trip);

                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        _logger.LogInformation("Booking {BookingReference} cancelled. Refund: {RefundAmount}", 
                            booking.BookingReference, refundAmount);

                        return Ok(new
                        {
                            message = "Booking cancelled successfully",
                            bookingReference = booking.BookingReference,
                            refundAmount = refundAmount.ToString("F2")
                        });
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        _logger.LogError(ex, "Error cancelling booking");
                        throw;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in CancelBooking");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get available seats for a trip
        /// </summary>
        [HttpGet("trip/{tripId}/available-seats")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetAvailableSeats(string tripId)
        {
            try
            {
                var trip = await _context.Trips.FindAsync(tripId);
                if (trip == null)
                {
                    return NotFound(new { error = "Trip not found" });
                }

                var availableSeats = await _context.Seats
                    .Where(s => s.TripId == tripId && s.IsAvailable)
                    .OrderBy(s => s.SeatNumber)
                    .Select(s => new
                    {
                        s.Id,
                        s.SeatNumber,
                        s.SeatType,
                        s.Price
                    })
                    .ToListAsync();

                return Ok(new
                {
                    tripId,
                    totalAvailable = availableSeats.Count,
                    seats = availableSeats
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching available seats");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        private string GenerateBookingReference()
        {
            // Format: BK + Date + Random (e.g., BK20251216ABC123)
            return $"BK{DateTime.UtcNow:yyyyMMdd}{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
        }

        private decimal CalculateRefund(Booking booking)
        {
            // Refund logic based on cancellation timing
            decimal refundPercentage = 100; // Default full refund

                if (booking.PaidAt.HasValue)
                {
                    var hoursTillDeparture = (booking.Trip.TripDate - DateTime.UtcNow).TotalHours;

                // 80% refund if cancelled 24-48 hours before
                if (hoursTillDeparture < 48 && hoursTillDeparture >= 24)
                    refundPercentage = 80;
                // 50% refund if cancelled less than 24 hours before
                else if (hoursTillDeparture < 24)
                    refundPercentage = 50;
            }

            return (decimal.Parse(booking.FinalAmount) * refundPercentage) / 100;
        }
    }

    public class CreateBookingRequest
    {
        public string UserId { get; set; }
        public string TripId { get; set; }
        public int NumberOfPassengers { get; set; }
        public string? TicketTypeId { get; set; }
        public string? Notes { get; set; }
    }

    public class CancelBookingRequest
    {
        public string? CancellationReason { get; set; }
    }
}
