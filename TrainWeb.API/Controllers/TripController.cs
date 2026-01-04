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
    public class TripController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TripController> _logger;

        public TripController(ApplicationDbContext context, ILogger<TripController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Search trips with filters - date, origin, destination
        /// </summary>
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<List<TripDto>>> SearchTrips(
            [FromQuery] string? originStation,
            [FromQuery] string? destinationStation,
            [FromQuery] string? tripDate,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                _logger.LogInformation("Searching trips - Origin: {Origin}, Destination: {Destination}, Date: {Date}",
                    originStation, destinationStation, tripDate);

                var query = _context.Trips
                    .Include(t => t.Train)
                    .Where(t => t.IsActive)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(originStation))
                    query = query.Where(t => t.OriginStation.Contains(originStation));

                if (!string.IsNullOrEmpty(destinationStation))
                    query = query.Where(t => t.DestinationStation.Contains(destinationStation));

                if (!string.IsNullOrEmpty(tripDate))
                {
                    if (DateTime.TryParse(tripDate, out var date))
                        query = query.Where(t => t.TripDate.Date == date.Date);
                }

                // Pagination
                var totalCount = await query.CountAsync();
                var trips = await query
                    .OrderBy(t => t.DepartureTime)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = trips.Select(t => new TripDto
                {
                    Id = t.Id,
                    TrainId = t.TrainId,
                    TrainName = t.Train?.TrainName,
                    OriginStation = t.OriginStation,
                    DestinationStation = t.DestinationStation,
                    DepartureTime = t.DepartureTime,
                    ArrivalTime = t.ArrivalTime,
                    TripDate = t.TripDate,
                    SeatsAvailable = t.SeatsAvailable,
                    TotalSeats = t.TotalSeats,
                    BasePrice = t.BasePrice,
                    Discount = t.Discount,
                    Status = t.Status,
                    Duration = t.Duration
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
                _logger.LogError(ex, "Error searching trips");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get all available trips
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<TripDto>>> GetAllTrips([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var trips = await _context.Trips
                    .Include(t => t.Train)
                    .Where(t => t.IsActive)
                    .OrderBy(t => t.TripDate)
                    .ThenBy(t => t.DepartureTime)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = trips.Select(t => new TripDto
                {
                    Id = t.Id,
                    TrainId = t.TrainId,
                    TrainName = t.Train?.TrainName,
                    OriginStation = t.OriginStation,
                    DestinationStation = t.DestinationStation,
                    DepartureTime = t.DepartureTime,
                    ArrivalTime = t.ArrivalTime,
                    TripDate = t.TripDate,
                    SeatsAvailable = t.SeatsAvailable,
                    TotalSeats = t.TotalSeats,
                    BasePrice = t.BasePrice,
                    Status = t.Status
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching trips");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get trip by ID with full details
        /// </summary>
        [HttpGet("{tripId}")]
        [AllowAnonymous]
        public async Task<ActionResult<TripDto>> GetTrip(string tripId)
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

                return Ok(new TripDto
                {
                    Id = trip.Id,
                    TrainId = trip.TrainId,
                    TrainName = trip.Train?.TrainName,
                    OriginStation = trip.OriginStation,
                    DestinationStation = trip.DestinationStation,
                    DepartureTime = trip.DepartureTime,
                    ArrivalTime = trip.ArrivalTime,
                    TripDate = trip.TripDate,
                    SeatsAvailable = trip.SeatsAvailable,
                    TotalSeats = trip.TotalSeats,
                    BasePrice = trip.BasePrice,
                    Discount = trip.Discount,
                    Status = trip.Status,
                    Duration = trip.Duration,
                    Notes = trip.Notes
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching trip");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Create new trip (Admin only)
        /// </summary>
        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult<TripDto>> CreateTrip([FromBody] CreateTripRequest request)
        {
            try
            {
                var train = await _context.Trains.FindAsync(request.TrainId);
                if (train == null)
                {
                    return BadRequest(new { error = "Train not found" });
                }

                if (!DateTime.TryParse(request.DepartureTime, out var departure))
                    return BadRequest(new { error = "Invalid departure time format" });
                if (!DateTime.TryParse(request.ArrivalTime, out var arrival))
                    return BadRequest(new { error = "Invalid arrival time format" });
                if (!DateTime.TryParse(request.TripDate, out var tripDateValue))
                    return BadRequest(new { error = "Invalid trip date format" });

                var trip = new Trip
                {
                    Id = Guid.NewGuid().ToString(),
                    TrainId = request.TrainId,
                    OriginStation = request.OriginStation,
                    DestinationStation = request.DestinationStation,
                    DepartureTime = departure,
                    ArrivalTime = arrival,
                    TripDate = tripDateValue,
                    BasePrice = request.BasePrice,
                    Status = "Scheduled",
                    TotalSeats = train.TotalSeats,
                    SeatsAvailable = train.TotalSeats,
                    Duration = CalculateDuration(departure, arrival),
                    Discount = request.Discount,
                    Notes = request.Notes,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Trips.Add(trip);

                // Auto-generate seats for the trip
                await GenerateSeatsForTrip(trip, train);

                await _context.SaveChangesAsync();

                _logger.LogInformation("Trip {TripId} created for train {TrainId}", trip.Id, trip.TrainId);

                return CreatedAtAction(nameof(GetTrip), new { tripId = trip.Id }, new TripDto
                {
                    Id = trip.Id,
                    TrainId = trip.TrainId,
                    OriginStation = trip.OriginStation,
                    DestinationStation = trip.DestinationStation,
                    DepartureTime = trip.DepartureTime,
                    ArrivalTime = trip.ArrivalTime,
                    TripDate = trip.TripDate,
                    BasePrice = trip.BasePrice,
                    Status = trip.Status
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating trip");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Update trip (Admin only)
        /// </summary>
        [HttpPut("{tripId}")]
        [Authorize]
        public async Task<ActionResult<TripDto>> UpdateTrip(string tripId, [FromBody] UpdateTripRequest request)
        {
            try
            {
                var trip = await _context.Trips.FindAsync(tripId);
                if (trip == null)
                {
                    return NotFound(new { error = "Trip not found" });
                }

                trip.BasePrice = request.BasePrice ?? trip.BasePrice;
                trip.Discount = request.Discount ?? trip.Discount;
                trip.Status = request.Status ?? trip.Status;
                trip.Notes = request.Notes ?? trip.Notes;
                trip.UpdatedAt = DateTime.UtcNow;

                _context.Trips.Update(trip);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Trip {TripId} updated", tripId);

                return Ok(new { message = "Trip updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating trip");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Delete trip (Admin only)
        /// </summary>
        [HttpDelete("{tripId}")]
        [Authorize]
        public async Task<ActionResult<object>> DeleteTrip(string tripId)
        {
            try
            {
                var trip = await _context.Trips.FindAsync(tripId);
                if (trip == null)
                {
                    return NotFound(new { error = "Trip not found" });
                }

                // Soft delete
                trip.IsActive = false;
                trip.UpdatedAt = DateTime.UtcNow;
                _context.Trips.Update(trip);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Trip {TripId} deleted", tripId);

                return Ok(new { message = "Trip deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting trip");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        private int CalculateDuration(DateTime departure, DateTime arrival)
        {
            return (int)(arrival - departure).TotalMinutes;
        }

        private async Task GenerateSeatsForTrip(Trip trip, Train train)
        {
            var seats = new List<Seat>();
            int seatNumber = 1;

            // Generate hard seats
            for (int i = 0; i < train.HardSeats; i++)
            {
                seats.Add(new Seat
                {
                    Id = Guid.NewGuid().ToString(),
                    TripId = trip.Id,
                    SeatNumber = $"HS{seatNumber++}",
                    SeatType = SeatType.HardSeat,
                    IsAvailable = true,
                    Price = trip.BasePrice,
                    CreatedAt = DateTime.UtcNow
                });
            }

            // Generate soft seats
            seatNumber = 1;
            for (int i = 0; i < train.SoftSeats; i++)
            {
                var softSeatPrice = (decimal.Parse(trip.BasePrice) * 1.25m).ToString("F2");
                seats.Add(new Seat
                {
                    Id = Guid.NewGuid().ToString(),
                    TripId = trip.Id,
                    SeatNumber = $"SS{seatNumber++}",
                    SeatType = SeatType.SoftSeat,
                    IsAvailable = true,
                    Price = softSeatPrice,
                    CreatedAt = DateTime.UtcNow
                });
            }

            _context.Seats.AddRange(seats);
        }
    }

    public class CreateTripRequest
    {
        public string TrainId { get; set; }
        public string OriginStation { get; set; }
        public string DestinationStation { get; set; }
        public string DepartureTime { get; set; }
        public string ArrivalTime { get; set; }
        public string TripDate { get; set; }
        public string BasePrice { get; set; }
        public string? Discount { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateTripRequest
    {
        public string? BasePrice { get; set; }
        public string? Discount { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
    }
}
