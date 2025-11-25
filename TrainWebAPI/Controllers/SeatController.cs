using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Services;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeatController : ControllerBase
    {
        private SeatService SeatService;

        public SeatController(SeatService seatService)
        {
            SeatService = seatService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var seat = await SeatService.GetById(id);
            if (seat == null) return NotFound("Seat Not Found");
            return Ok(seat.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var seats = await SeatService.GetAllAsync();
            return Ok(seats.Select(seat => seat.ToDto()));
        }

        [HttpGet("trip/{tripId}")]
        public async Task<IActionResult> GetByTripId([FromRoute] string tripId)
        {
            var seats = await SeatService.GetByTripIdAsync(tripId);
            return Ok(seats.Select(seat => seat.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SeatDto seatDto)
        {
            var createdSeat = await SeatService.AddAsync(seatDto.FromDto());
            if (createdSeat == null)
            {
                return Problem("Failed to create seat.");
            }
            return Ok(createdSeat.ToDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] string id, [FromBody] SeatDto seatDto)
        {
            var seat = await SeatService.GetById(id);

            if (seat == null)
            {
                return NotFound("Seat Not Found");
            }

            seatDto.Id = seat.Id;

            var updatedSeat = await SeatService.UpdateAsync(id, seatDto.FromDto());

            return Ok(updatedSeat?.ToDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            await SeatService.DeleteAsync(id);
            return Ok();
        }
    }
}
