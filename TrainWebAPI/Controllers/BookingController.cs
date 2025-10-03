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
            if (booking == null) return NotFound("Book Not Found");
            return Ok(booking.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var bookings = await BookingService.GetAllAsync();
            return Ok(bookings.Select(booking => booking.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] BookingDto bookingDto
        )
        {
            var createdBooking = await BookingService.AddAsync(bookingDto.FromDto());
            return Ok(createdBooking?.ToDto());
        }
    }
}
