using FirebaseAdmin;
using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Extensions;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private BookingService BookingService { get; }

        public BookingController(BookingService bookingService)
        {
            BookingService = bookingService;
        }
        ///Create/Get/List/Update/Delete ticket/ticket-type
        ///Buy ticket/Get QR code ticket
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var booking = await BookingService.GetById(id);
            return Ok(booking.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var bookings = await BookingService.GetAllAsync();
            return Ok(bookings.Select(booking => booking.ToDto()));
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId([FromRoute] string userId)
        {
            var bookings = await BookingService.GetByUserIdAsync(userId);
            return Ok(bookings.Select(booking => booking.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BookingDto bookingDto)
        {
            var createdBooking = await BookingService.AddAsync(bookingDto.FromDto());
            return Ok(createdBooking?.ToDto());
        }

        [HttpPost("{id}/success-booking")]
        public async Task<IActionResult> SuccessBoooking([FromRoute] string id)
        {
            await BookingService.SucceedBookingAsync(id);
            return Ok();
        }

        [HttpPost("{id}/cancel-booking")]
        public async Task<IActionResult> CancelBoooking([FromRoute] string id)
        {
            await BookingService.CancelledBookingAsync(id);
            return Ok();
        }
    }
}
