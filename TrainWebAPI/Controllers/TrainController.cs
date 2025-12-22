using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Services;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainController : ControllerBase
    {
        private readonly TrainService _trainService;

        public TrainController(TrainService trainService)
        {
            _trainService = trainService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var train = await _trainService.GetByIdAsync(id);
            if (train == null) return NotFound("Train Not Found");

            return Ok(train.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trains = await _trainService.GetAllAsync();
            return Ok(trains.Select(t => t.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TrainDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");
            if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest("Name is required");
            if (string.IsNullOrWhiteSpace(dto.Type)) return BadRequest("Type is required");

            dto.Id = null;

            var created = await _trainService.AddAsync(dto.FromDto());
            return Ok(created.ToDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] string id, [FromBody] TrainDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");
            if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest("Name is required");
            if (string.IsNullOrWhiteSpace(dto.Type)) return BadRequest("Type is required");

            var existing = await _trainService.GetByIdAsync(id);
            if (existing == null) return NotFound("Train Not Found");

            dto.Id = id;

            var updated = await _trainService.UpdateAsync(id, dto.FromDto());
            if (updated == null) return NotFound("Train Not Found");

            return Ok(updated.ToDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var existing = await _trainService.GetByIdAsync(id);
            if (existing == null) return NotFound("Train Not Found");

            await _trainService.DeleteAsync(id);
            return Ok();
        }
    }
}
