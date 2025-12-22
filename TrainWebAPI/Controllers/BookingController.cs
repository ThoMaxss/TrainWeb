using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Extensions;
using TrainWeb.Application.Services;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var booking = await _bookingService.GetByIdAsync(id);
            if (booking == null) return NotFound("Booking Not Found");

            return Ok(booking.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var bookings = await _bookingService.GetAllAsync();
            return Ok(bookings.Select(b => b.ToDto()));
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId([FromRoute] string userId)
        {
            var bookings = await _bookingService.GetByUserIdAsync(userId);
            return Ok(bookings.Select(b => b.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BookingDto bookingDto)
        {
            if (bookingDto == null) return BadRequest("Invalid payload");
            if (string.IsNullOrWhiteSpace(bookingDto.UserId)) return BadRequest("UserId is required");
            if (string.IsNullOrWhiteSpace(bookingDto.TripId)) return BadRequest("TripId is required");
            if (string.IsNullOrWhiteSpace(bookingDto.SeatId)) return BadRequest("SeatId is required");

            var created = await _bookingService.CreateAsync(
                userId: bookingDto.UserId!,
                tripId: bookingDto.TripId!,
                seatId: bookingDto.SeatId!,
                ticketTypeId: bookingDto.TicketTypeId
            );

            return Ok(created.ToDto());
        }

        [HttpPost("{id}/success-booking")]
        public async Task<IActionResult> SuccessBooking([FromRoute] string id)
        {
            await _bookingService.SucceedBookingAsync(id);
            return Ok();
        }

        [HttpPost("{id}/cancel-booking")]
        public async Task<IActionResult> CancelBooking([FromRoute] string id)
        {
            await _bookingService.CancelBookingAsync(id);
            return Ok();
        }
    }
}
