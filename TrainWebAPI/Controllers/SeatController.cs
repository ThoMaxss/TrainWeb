using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Services;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/trips/{tripId}/seats")]
    public class SeatController : ControllerBase
    {
        private readonly SeatService _seatService;

        public SeatController(SeatService seatService)
        {
            _seatService = seatService;
        }

        [HttpGet("{seatId}")]
        public async Task<IActionResult> Get(string tripId, string seatId)
        {
            var seat = await _seatService.GetByIdAsync(tripId, seatId);
            if (seat == null) return NotFound("Seat Not Found");
            return Ok(seat.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetByTrip(string tripId)
        {
            var seats = await _seatService.GetByTripIdAsync(tripId);
            return Ok(seats.Select(s => s.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create(string tripId, [FromBody] SeatDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");
            dto.TripId = tripId;

            var created = await _seatService.AddAsync(tripId, dto.FromDto());
            return Ok(created.ToDto());
        }

        [HttpPut("{seatId}")]
        public async Task<IActionResult> Update(string tripId, string seatId, [FromBody] SeatDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");
            dto.Id = seatId;
            dto.TripId = tripId;

            var updated = await _seatService.UpdateAsync(tripId, seatId, dto.FromDto());
            if (updated == null) return NotFound("Seat Not Found");

            return Ok(updated.ToDto());
        }

        [HttpDelete("{seatId}")]
        public async Task<IActionResult> Delete(string tripId, string seatId)
        {
            var existing = await _seatService.GetByIdAsync(tripId, seatId);
            if (existing == null) return NotFound("Seat Not Found");

            await _seatService.DeleteAsync(tripId, seatId);
            return Ok();
        }

        [HttpPatch("{seatId}/availability")]
        public async Task<IActionResult> UpdateAvailability(string tripId, string seatId, [FromQuery] bool isAvailable)
        {
            var existing = await _seatService.GetByIdAsync(tripId, seatId);
            if (existing == null) return NotFound("Seat Not Found");

            if (isAvailable) await _seatService.MarkSeatAsAvailable(tripId, seatId);
            else await _seatService.MarkSeatAsUnavailable(tripId, seatId);

            return Ok();
        }
    }
}
