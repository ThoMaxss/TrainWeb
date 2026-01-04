using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainWeb.Application.DTOs;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enums;
using TrainWeb.Infrastructure.Data;
using System.Text;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<TicketController> _logger;

        public TicketController(ApplicationDbContext context, ILogger<TicketController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get tickets for user
        /// </summary>
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<TicketDto>>> GetUserTickets(string userId)
        {
            try
            {
                var tickets = await _context.Tickets
                    .Where(t => t.UserId == userId)
                    .Include(t => t.Booking)
                    .Include(t => t.Seat)
                    .OrderByDescending(t => t.CreatedAt)
                    .ToListAsync();

                if (tickets.Count == 0)
                {
                    return Ok(new List<TicketDto>());
                }

                var result = tickets.Select(t => new TicketDto
                {
                    Id = t.Id,
                    BookingId = t.BookingId,
                    TicketNumber = t.TicketNumber,
                    SeatNumber = t.SeatNumber,
                    JourneyDate = t.JourneyDate,
                    DepartureStation = t.DepartureStation,
                    ArrivalStation = t.ArrivalStation,
                    DepartureTime = t.DepartureTime,
                    ArrivalTime = t.ArrivalTime,
                    Price = t.Price,
                    Status = ((TicketStatus)t.Status).ToString(),
                    QRCode = t.QRCode,
                    PassengerName = t.PassengerName,
                    SeatType = ((SeatType)t.SeatType).ToString(),
                    UsedAt = t.UsedAt,
                    CreatedAt = t.CreatedAt
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user tickets");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get booking tickets
        /// </summary>
        [HttpGet("booking/{bookingId}")]
        public async Task<ActionResult<List<TicketDto>>> GetBookingTickets(string bookingId)
        {
            try
            {
                var booking = await _context.Bookings.FindAsync(bookingId);
                if (booking == null)
                {
                    return NotFound(new { error = "Booking not found" });
                }

                var tickets = await _context.Tickets
                    .Where(t => t.BookingId == bookingId)
                    .OrderBy(t => t.SeatNumber)
                    .ToListAsync();

                var result = tickets.Select(t => new TicketDto
                {
                    Id = t.Id,
                    TicketNumber = t.TicketNumber,
                    SeatNumber = t.SeatNumber,
                    JourneyDate = t.JourneyDate,
                    DepartureStation = t.DepartureStation,
                    ArrivalStation = t.ArrivalStation,
                    DepartureTime = t.DepartureTime,
                    ArrivalTime = t.ArrivalTime,
                    Price = t.Price,
                    Status = ((TicketStatus)t.Status).ToString(),
                    QRCode = t.QRCode
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching booking tickets");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get single ticket
        /// </summary>
        [HttpGet("{ticketId}")]
        [AllowAnonymous]
        public async Task<ActionResult<TicketDto>> GetTicket(string ticketId)
        {
            try
            {
                var ticket = await _context.Tickets
                    .Include(t => t.Booking)
                    .FirstOrDefaultAsync(t => t.Id == ticketId);

                if (ticket == null)
                {
                    return NotFound(new { error = "Ticket not found" });
                }

                return Ok(new TicketDto
                {
                    Id = ticket.Id,
                    TicketNumber = ticket.TicketNumber,
                    SeatNumber = ticket.SeatNumber,
                    JourneyDate = ticket.JourneyDate,
                    DepartureStation = ticket.DepartureStation,
                    ArrivalStation = ticket.ArrivalStation,
                    DepartureTime = ticket.DepartureTime,
                    ArrivalTime = ticket.ArrivalTime,
                    Price = ticket.Price,
                    Status = ((TicketStatus)ticket.Status).ToString(),
                    QRCode = ticket.QRCode,
                    PassengerName = ticket.PassengerName,
                    SeatType = ((SeatType)ticket.SeatType).ToString(),
                    UsedAt = ticket.UsedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching ticket");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Generate tickets for a booking (called after payment)
        /// </summary>
        [HttpPost("generate-for-booking/{bookingId}")]
        public async Task<ActionResult<object>> GenerateTicketsForBooking(string bookingId, [FromBody] GenerateTicketsRequest request)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.Trip)
                    .FirstOrDefaultAsync(b => b.Id == bookingId);

                if (booking == null)
                {
                    return BadRequest(new { error = "Booking not found" });
                }

                if (booking.Status != BookingStatus.Paid)
                {
                    return BadRequest(new { error = "Booking must be paid before generating tickets" });
                }

                // Get booked seats for this booking
                var bookedSeats = await _context.Seats
                    .Where(s => s.BookingReference == booking.BookingReference)
                    .ToListAsync();

                if (bookedSeats.Count == 0)
                {
                    return BadRequest(new { error = "No seats found for booking" });
                }

                if (bookedSeats.Count != request.PassengerNames.Count)
                {
                    return BadRequest(new { 
                        error = "Number of passenger names must match number of seats",
                        seatsCount = bookedSeats.Count,
                        passengersCount = request.PassengerNames.Count
                    });
                }

                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        var tickets = new List<Ticket>();
                        int passengerIndex = 0;

                        foreach (var seat in bookedSeats.OrderBy(s => s.SeatNumber))
                        {
                            var ticket = new Ticket
                            {
                                Id = Guid.NewGuid().ToString(),
                                UserId = booking.UserId,
                                BookingId = booking.Id,
                                SeatId = seat.Id,
                                TicketNumber = GenerateTicketNumber(),
                                SeatNumber = seat.SeatNumber,
                                JourneyDate = booking.Trip.TripDate,
                                DepartureStation = booking.Trip.OriginStation,
                                ArrivalStation = booking.Trip.DestinationStation,
                                DepartureTime = booking.Trip.DepartureTime,
                                ArrivalTime = booking.Trip.ArrivalTime,
                                Price = seat.Price,
                                Status = (int)TicketStatus.Active,
                                PassengerName = request.PassengerNames[passengerIndex],
                                SeatType = (int)seat.SeatType,
                                QRCode = GenerateQRCode(booking.BookingReference, seat.SeatNumber),
                                CreatedAt = DateTime.UtcNow
                            };

                            tickets.Add(ticket);
                            passengerIndex++;
                        }

                        _context.Tickets.AddRange(tickets);

                        // Update booking status to Completed
                        booking.Status = BookingStatus.Completed;
                        booking.UpdatedAt = DateTime.UtcNow;
                        _context.Bookings.Update(booking);

                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        _logger.LogInformation("Generated {TicketCount} tickets for booking {BookingId}", 
                            tickets.Count, bookingId);

                        return Ok(new
                        {
                            message = "Tickets generated successfully",
                            ticketCount = tickets.Count,
                            tickets = tickets.Select(t => new
                            {
                                t.Id,
                                t.TicketNumber,
                                t.SeatNumber,
                                t.PassengerName,
                                t.QRCode
                            }).ToList()
                        });
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        _logger.LogError(ex, "Error generating tickets");
                        throw;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GenerateTicketsForBooking");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Check-in ticket (mark as used)
        /// </summary>
        [HttpPost("{ticketId}/checkin")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> CheckinTicket(string ticketId)
        {
            try
            {
                var ticket = await _context.Tickets.FindAsync(ticketId);
                if (ticket == null)
                {
                    return NotFound(new { error = "Ticket not found" });
                }

                if ((TicketStatus)ticket.Status != TicketStatus.Active)
                {
                    return BadRequest(new { error = $"Ticket is {ticket.Status}, cannot check in" });
                }

                // Verify trip departure time hasn't passed
                var booking = await _context.Bookings
                    .Include(b => b.Trip)
                    .FirstOrDefaultAsync(b => b.Id == ticket.BookingId);

                if (booking?.Trip != null && booking.Trip.DepartureTime < DateTime.UtcNow)
                {
                    return BadRequest(new { error = "Trip has already departed" });
                }

                ticket.Status = (int)TicketStatus.Used;
                ticket.UsedAt = DateTime.UtcNow;
                _context.Tickets.Update(ticket);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Ticket {TicketNumber} checked in", ticket.TicketNumber);

                return Ok(new { 
                    message = "Ticket checked in successfully",
                    ticketNumber = ticket.TicketNumber,
                    seatNumber = ticket.SeatNumber,
                    checkinTime = ticket.UsedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking in ticket");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Cancel ticket
        /// </summary>
        [HttpPost("{ticketId}/cancel")]
        public async Task<ActionResult<object>> CancelTicket(string ticketId)
        {
            try
            {
                var ticket = await _context.Tickets.FindAsync(ticketId);
                if (ticket == null)
                {
                    return NotFound(new { error = "Ticket not found" });
                }

                if ((TicketStatus)ticket.Status == TicketStatus.Cancelled)
                {
                    return BadRequest(new { error = "Ticket is already cancelled" });
                }

                if ((TicketStatus)ticket.Status == TicketStatus.Used)
                {
                    return BadRequest(new { error = "Cannot cancel used ticket" });
                }

                ticket.Status = (int)TicketStatus.Cancelled;
                ticket.CancelledAt = DateTime.UtcNow;
                _context.Tickets.Update(ticket);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Ticket {TicketNumber} cancelled", ticket.TicketNumber);

                return Ok(new { 
                    message = "Ticket cancelled successfully",
                    ticketNumber = ticket.TicketNumber
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling ticket");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Verify ticket by QR code
        /// </summary>
        [HttpGet("verify/{qrCode}")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> VerifyTicket(string qrCode)
        {
            try
            {
                var ticket = await _context.Tickets
                    .Include(t => t.Booking)
                    .FirstOrDefaultAsync(t => t.QRCode == qrCode);

                if (ticket == null)
                {
                    return NotFound(new { error = "Invalid QR code" });
                }

                return Ok(new
                {
                    valid = (TicketStatus)ticket.Status == TicketStatus.Active,
                    ticketNumber = ticket.TicketNumber,
                    seatNumber = ticket.SeatNumber,
                    passengerName = ticket.PassengerName,
                    journeyDate = ticket.JourneyDate,
                    departureStation = ticket.DepartureStation,
                    arrivalStation = ticket.ArrivalStation,
                    status = ((TicketStatus)ticket.Status).ToString(),
                    usedAt = ticket.UsedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying ticket");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        private string GenerateTicketNumber()
        {
            // Format: TK + Date + Random (e.g., TK20251216ABC12345)
            return $"TK{DateTime.UtcNow:yyyyMMdd}{Guid.NewGuid().ToString().Substring(0, 10).ToUpper()}";
        }

        private string GenerateQRCode(string bookingReference, string seatNumber)
        {
            // In production: generate actual QR code image
            // For now, return encoded string that contains ticket info
            var qrData = $"{bookingReference}|{seatNumber}|{DateTime.UtcNow:yyyyMMddHHmmss}";
            var base64String = Convert.ToBase64String(Encoding.UTF8.GetBytes(qrData));
            return $"QR-{base64String}";
        }
    }

    public class GenerateTicketsRequest
    {
        public List<string> PassengerNames { get; set; } = new();
    }
}
