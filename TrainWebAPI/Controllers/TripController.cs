using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Services;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripController : ControllerBase
    {
        private readonly TripService _tripService;

        public TripController(TripService tripService)
        {
            _tripService = tripService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var trip = await _tripService.GetByIdAsync(id);
            if (trip == null) return NotFound("Trip Not Found");

            return Ok(trip.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trips = await _tripService.GetAllAsync();
            return Ok(trips.Select(t => t.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TripDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");

            dto.Id = null; 
            var created = await _tripService.AddAsync(dto.FromDto());

            return Ok(created.ToDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] string id, [FromBody] TripDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");

            var existing = await _tripService.GetByIdAsync(id);
            if (existing == null) return NotFound("Trip Not Found");

            dto.Id = id; 
            var updated = await _tripService.UpdateAsync(id, dto.FromDto());
            if (updated == null) return NotFound("Trip Not Found");

            return Ok(updated.ToDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var existing = await _tripService.GetByIdAsync(id);
            if (existing == null) return NotFound("Trip Not Found");

            await _tripService.DeleteAsync(id);
            return Ok();
        }
    }
}
