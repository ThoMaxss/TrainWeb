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
    public class TrainController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TrainController> _logger;

        public TrainController(ApplicationDbContext context, ILogger<TrainController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all trains
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<TrainDto>>> GetAllTrains([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var trains = await _context.Trains
                    .Where(t => t.IsActive)
                    .OrderBy(t => t.TrainName)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = trains.Select(t => new TrainDto
                {
                    Id = t.Id,
                    TrainNumber = t.TrainNumber,
                    TrainName = t.TrainName,
                    TrainType = t.TrainType,
                    TotalSeats = t.TotalSeats,
                    AvailableSeats = t.AvailableSeats,
                    HardSeats = t.HardSeats,
                    SoftSeats = t.SoftSeats,
                    Amenities = t.Amenities,
                    HasAC = t.HasAC,
                    HasWiFi = t.HasWiFi,
                    HasFoodService = t.HasFoodService,
                    HasToilet = t.HasToilet,
                    MaxSpeed = t.MaxSpeed,
                    Manufacturer = t.Manufacturer,
                    YearOfManufacture = t.YearOfManufacture
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching trains");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get train by ID
        /// </summary>
        [HttpGet("{trainId}")]
        [AllowAnonymous]
        public async Task<ActionResult<TrainDto>> GetTrain(string trainId)
        {
            try
            {
                var train = await _context.Trains.FindAsync(trainId);
                if (train == null)
                {
                    return NotFound(new { error = "Train not found" });
                }

                return Ok(new TrainDto
                {
                    Id = train.Id,
                    TrainNumber = train.TrainNumber,
                    TrainName = train.TrainName,
                    TrainType = train.TrainType,
                    TotalSeats = train.TotalSeats,
                    AvailableSeats = train.AvailableSeats,
                    HardSeats = train.HardSeats,
                    SoftSeats = train.SoftSeats,
                    Amenities = train.Amenities,
                    HasAC = train.HasAC,
                    HasWiFi = train.HasWiFi,
                    HasFoodService = train.HasFoodService,
                    HasToilet = train.HasToilet,
                    MaxSpeed = train.MaxSpeed,
                    Manufacturer = train.Manufacturer,
                    YearOfManufacture = train.YearOfManufacture,
                    OperatingCompany = train.OperatingCompany
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching train");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Create new train (Admin only)
        /// </summary>
        [HttpPost("create")]
        [Authorize]
        public async Task<ActionResult<TrainDto>> CreateTrain([FromBody] CreateTrainRequest request)
        {
            try
            {
                // Validate train number is unique
                var existingTrain = await _context.Trains
                    .FirstOrDefaultAsync(t => t.TrainNumber == request.TrainNumber);

                if (existingTrain != null)
                {
                    return BadRequest(new { error = "Train number already exists" });
                }

                // Validate seat counts
                int totalSeats = request.HardSeats + request.SoftSeats;
                if (totalSeats <= 0)
                {
                    return BadRequest(new { error = "Total seats must be greater than 0" });
                }

                var train = new Train
                {
                    Id = Guid.NewGuid().ToString(),
                    TrainNumber = request.TrainNumber,
                    TrainName = request.TrainName,
                    TrainType = request.TrainType,
                    TotalSeats = totalSeats,
                    AvailableSeats = totalSeats,
                    HardSeats = request.HardSeats,
                    SoftSeats = request.SoftSeats,
                    Amenities = request.Amenities,
                    HasAC = request.HasAC,
                    HasWiFi = request.HasWiFi,
                    HasFoodService = request.HasFoodService,
                    HasToilet = request.HasToilet,
                    MaxSpeed = request.MaxSpeed,
                    Manufacturer = request.Manufacturer,
                    YearOfManufacture = request.YearOfManufacture,
                    OperatingCompany = request.OperatingCompany,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Trains.Add(train);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Train {TrainId} created with number {TrainNumber}", train.Id, train.TrainNumber);

                return CreatedAtAction(nameof(GetTrain), new { trainId = train.Id }, new TrainDto
                {
                    Id = train.Id,
                    TrainNumber = train.TrainNumber,
                    TrainName = train.TrainName,
                    TrainType = train.TrainType,
                    TotalSeats = train.TotalSeats,
                    HardSeats = train.HardSeats,
                    SoftSeats = train.SoftSeats
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating train");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Update train details (Admin only)
        /// </summary>
        [HttpPut("{trainId}")]
        [Authorize]
        public async Task<ActionResult<object>> UpdateTrain(string trainId, [FromBody] UpdateTrainRequest request)
        {
            try
            {
                var train = await _context.Trains.FindAsync(trainId);
                if (train == null)
                {
                    return NotFound(new { error = "Train not found" });
                }

                train.TrainName = request.TrainName ?? train.TrainName;
                train.TrainType = request.TrainType ?? train.TrainType;
                train.Amenities = request.Amenities ?? train.Amenities;
                train.HasAC = request.HasAC ?? train.HasAC;
                train.HasWiFi = request.HasWiFi ?? train.HasWiFi;
                train.HasFoodService = request.HasFoodService ?? train.HasFoodService;
                train.HasToilet = request.HasToilet ?? train.HasToilet;
                train.MaxSpeed = request.MaxSpeed ?? train.MaxSpeed;
                train.OperatingCompany = request.OperatingCompany ?? train.OperatingCompany;
                train.UpdatedAt = DateTime.UtcNow;

                _context.Trains.Update(train);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Train {TrainId} updated", trainId);

                return Ok(new { message = "Train updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating train");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Delete train (Admin only)
        /// </summary>
        [HttpDelete("{trainId}")]
        [Authorize]
        public async Task<ActionResult<object>> DeleteTrain(string trainId)
        {
            try
            {
                var train = await _context.Trains.FindAsync(trainId);
                if (train == null)
                {
                    return NotFound(new { error = "Train not found" });
                }

                // Check if train has active trips
                var activeTrips = await _context.Trips
                    .CountAsync(t => t.TrainId == trainId && t.IsActive);

                if (activeTrips > 0)
                {
                    return BadRequest(new { error = "Cannot delete train with active trips" });
                }

                // Soft delete
                train.IsActive = false;
                train.UpdatedAt = DateTime.UtcNow;
                _context.Trains.Update(train);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Train {TrainId} deleted", trainId);

                return Ok(new { message = "Train deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting train");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Search trains by type or name
        /// </summary>
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<ActionResult<List<TrainDto>>> SearchTrains([FromQuery] string? trainType, [FromQuery] string? searchTerm)
        {
            try
            {
                var query = _context.Trains
                    .Where(t => t.IsActive)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(trainType))
                    query = query.Where(t => t.TrainType.Contains(trainType));

                if (!string.IsNullOrEmpty(searchTerm))
                    query = query.Where(t => t.TrainName.Contains(searchTerm) || t.TrainNumber.Contains(searchTerm));

                var trains = await query
                    .OrderBy(t => t.TrainName)
                    .ToListAsync();

                var result = trains.Select(t => new TrainDto
                {
                    Id = t.Id,
                    TrainNumber = t.TrainNumber,
                    TrainName = t.TrainName,
                    TrainType = t.TrainType,
                    TotalSeats = t.TotalSeats,
                    AvailableSeats = t.AvailableSeats,
                    HardSeats = t.HardSeats,
                    SoftSeats = t.SoftSeats,
                    Amenities = t.Amenities
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching trains");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
    }

    public class CreateTrainRequest
    {
        public string TrainNumber { get; set; }
        public string TrainName { get; set; }
        public string TrainType { get; set; }
        public int HardSeats { get; set; }
        public int SoftSeats { get; set; }
        public string? Amenities { get; set; }
        public bool HasAC { get; set; }
        public bool HasWiFi { get; set; }
        public bool HasFoodService { get; set; }
        public bool HasToilet { get; set; }
        public string? MaxSpeed { get; set; }
        public string? Manufacturer { get; set; }
        public int? YearOfManufacture { get; set; }
        public string? OperatingCompany { get; set; }
    }

    public class UpdateTrainRequest
    {
        public string? TrainName { get; set; }
        public string? TrainType { get; set; }
        public string? Amenities { get; set; }
        public bool? HasAC { get; set; }
        public bool? HasWiFi { get; set; }
        public bool? HasFoodService { get; set; }
        public bool? HasToilet { get; set; }
        public string? MaxSpeed { get; set; }
        public string? OperatingCompany { get; set; }
    }
}
