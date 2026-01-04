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
    [AllowAnonymous]
    public class SeatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SeatController> _logger;

        public SeatController(ApplicationDbContext context, ILogger<SeatController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all seats for a trip
        /// </summary>
        [HttpGet("trip/{tripId}")]
        public async Task<ActionResult<object>> GetTripSeats(string tripId)
        {
            try
            {
                var trip = await _context.Trips.FindAsync(tripId);
                if (trip == null)
                {
                    return NotFound(new { error = "Trip not found" });
                }

                var seats = await _context.Seats
                    .Where(s => s.TripId == tripId)
                    .OrderBy(s => s.SeatNumber)
                    .Select(s => new
                    {
                        s.Id,
                        s.SeatNumber,
                        s.SeatType,
                        s.IsAvailable,
                        s.Price,
                        bookedBy = s.IsAvailable ? null : s.BookedByUserId
                    })
                    .ToListAsync();

                var hardSeats = seats.Where(s => s.SeatType == SeatType.HardSeat).ToList();
                var softSeats = seats.Where(s => s.SeatType == SeatType.SoftSeat).ToList();

                return Ok(new
                {
                    tripId,
                    totalSeats = seats.Count,
                    availableSeats = seats.Count(s => s.IsAvailable),
                    hardSeats = new
                    {
                        total = hardSeats.Count,
                        available = hardSeats.Count(s => s.IsAvailable),
                        seats = hardSeats
                    },
                    softSeats = new
                    {
                        total = softSeats.Count,
                        available = softSeats.Count(s => s.IsAvailable),
                        seats = softSeats
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching trip seats");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get available seats for a trip
        /// </summary>
        [HttpGet("trip/{tripId}/available")]
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

                var hardSeats = availableSeats.Where(s => s.SeatType == SeatType.HardSeat).ToList();
                var softSeats = availableSeats.Where(s => s.SeatType == SeatType.SoftSeat).ToList();

                return Ok(new
                {
                    tripId,
                    totalAvailable = availableSeats.Count,
                    hardSeats = new
                    {
                        count = hardSeats.Count,
                        seats = hardSeats
                    },
                    softSeats = new
                    {
                        count = softSeats.Count,
                        seats = softSeats
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching available seats");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get seat details
        /// </summary>
        [HttpGet("{seatId}")]
        public async Task<ActionResult<object>> GetSeat(string seatId)
        {
            try
            {
                var seat = await _context.Seats
                    .Include(s => s.Trip)
                    .FirstOrDefaultAsync(s => s.Id == seatId);

                if (seat == null)
                {
                    return NotFound(new { error = "Seat not found" });
                }

                return Ok(new
                {
                    seat.Id,
                    seat.SeatNumber,
                    seat.SeatType,
                    seat.IsAvailable,
                    seat.Price,
                    tripId = seat.Trip?.Id,
                    tripDate = seat.Trip?.TripDate,
                    bookedAt = seat.BookedAt,
                    bookedByUserId = seat.IsAvailable ? null : seat.BookedByUserId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching seat");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get seat layout/map for a trip (visual representation)
        /// </summary>
        [HttpGet("trip/{tripId}/layout")]
        public async Task<ActionResult<object>> GetSeatLayout(string tripId)
        {
            try
            {
                var trip = await _context.Trips
                    .Include(t => t.Train)
                    .FirstOrDefaultAsync(t => t.Id == tripId);

                if (trip == null)
                {
                    return NotFound(new { error = "Trip not found" });
                }

                var seats = await _context.Seats
                    .Where(s => s.TripId == tripId)
                    .OrderBy(s => s.SeatNumber)
                    .ToListAsync();

                // Organize seats into rows (6 seats per row: 2 hard, 2 soft layout)
                var seatLayout = new List<List<object>>();
                var seatsPerRow = 6;
                var currentRow = new List<object>();

                foreach (var seat in seats)
                {
                    currentRow.Add(new
                    {
                        seat.Id,
                        seat.SeatNumber,
                        seat.SeatType,
                        seat.IsAvailable,
                        seat.Price,
                        status = seat.IsAvailable ? "available" : "booked"
                    });

                    if (currentRow.Count == seatsPerRow)
                    {
                        seatLayout.Add(currentRow);
                        currentRow = new List<object>();
                    }
                }

                if (currentRow.Count > 0)
                {
                    seatLayout.Add(currentRow);
                }

                return Ok(new
                {
                    tripId,
                    trainName = trip.Train?.TrainName,
                    tripDate = trip.TripDate,
                    departureTime = trip.DepartureTime,
                    arrivalTime = trip.ArrivalTime,
                    totalSeats = seats.Count,
                    availableSeats = seats.Count(s => s.IsAvailable),
                    layout = seatLayout,
                    stats = new
                    {
                        hardSeats = new
                        {
                            total = seats.Count(s => s.SeatType == SeatType.HardSeat),
                            available = seats.Count(s => s.SeatType == SeatType.HardSeat && s.IsAvailable)
                        },
                        softSeats = new
                        {
                            total = seats.Count(s => s.SeatType == SeatType.SoftSeat),
                            available = seats.Count(s => s.SeatType == SeatType.SoftSeat && s.IsAvailable)
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching seat layout");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get occupancy statistics for a trip
        /// </summary>
        [HttpGet("trip/{tripId}/occupancy")]
        public async Task<ActionResult<object>> GetOccupancyStats(string tripId)
        {
            try
            {
                var trip = await _context.Trips.FindAsync(tripId);
                if (trip == null)
                {
                    return NotFound(new { error = "Trip not found" });
                }

                var allSeats = await _context.Seats
                    .Where(s => s.TripId == tripId)
                    .ToListAsync();

                var totalSeats = allSeats.Count;
                var availableSeats = allSeats.Count(s => s.IsAvailable);
                var bookedSeats = totalSeats - availableSeats;
                var occupancyPercentage = totalSeats > 0 ? (bookedSeats * 100.0) / totalSeats : 0;

                var hardSeats = allSeats.Where(s => s.SeatType == SeatType.HardSeat).ToList();
                var softSeats = allSeats.Where(s => s.SeatType == SeatType.SoftSeat).ToList();

                return Ok(new
                {
                    tripId,
                    totalSeats,
                    availableSeats,
                    bookedSeats,
                    occupancyPercentage = Math.Round(occupancyPercentage, 2),
                        hardSeats = new
                        {
                            total = hardSeats.Count,
                            available = hardSeats.Count(s => s.IsAvailable),
                            booked = hardSeats.Count(s => !s.IsAvailable),
                            occupancyPercentage = hardSeats.Count > 0 
                                ? Math.Round((hardSeats.Count(s => !s.IsAvailable) * 100.0) / hardSeats.Count, 2)
                                : 0
                        },
                        softSeats = new
                        {
                            total = softSeats.Count,
                            available = softSeats.Count(s => s.IsAvailable),
                            booked = softSeats.Count(s => !s.IsAvailable),
                            occupancyPercentage = softSeats.Count > 0 
                                ? Math.Round((softSeats.Count(s => !s.IsAvailable) * 100.0) / softSeats.Count, 2)
                                : 0
                        }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching occupancy stats");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Update seat price (Admin only)
        /// </summary>
        [HttpPut("{seatId}/price")]
        [Authorize]
        public async Task<ActionResult<object>> UpdateSeatPrice(string seatId, [FromBody] UpdateSeatPriceRequest request)
        {
            try
            {
                var seat = await _context.Seats.FindAsync(seatId);
                if (seat == null)
                {
                    return NotFound(new { error = "Seat not found" });
                }

                if (decimal.Parse(request.NewPrice) <= 0)
                {
                    return BadRequest(new { error = "Price must be greater than 0" });
                }

                seat.Price = request.NewPrice;
                seat.UpdatedAt = DateTime.UtcNow;
                _context.Seats.Update(seat);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Seat {SeatId} price updated to {Price}", seatId, request.NewPrice);

                return Ok(new { 
                    message = "Seat price updated successfully",
                    seatId,
                    newPrice = request.NewPrice
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating seat price");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get booked seats for a specific user on a trip
        /// </summary>
        [HttpGet("trip/{tripId}/user/{userId}")]
        [Authorize]
        public async Task<ActionResult<List<object>>> GetUserBookedSeats(string tripId, string userId)
        {
            try
            {
                var seats = await _context.Seats
                    .Where(s => s.TripId == tripId && s.BookedByUserId == userId)
                    .OrderBy(s => s.SeatNumber)
                    .Select(s => new
                    {
                        s.Id,
                        s.SeatNumber,
                        s.SeatType,
                        s.Price,
                        s.BookedAt,
                        s.BookingReference
                    })
                    .ToListAsync();

                return Ok(seats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user booked seats");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
    }

    public class UpdateSeatPriceRequest
    {
        public string NewPrice { get; set; }
    }
}
