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
    public class TicketTypeController : ControllerBase
    {
        private readonly TicketTypeService _ticketTypeService;

        public TicketTypeController(TicketTypeService ticketTypeService)
        {
            _ticketTypeService = ticketTypeService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var ticketType = await _ticketTypeService.GetByIdAsync(id);
            if (ticketType == null) return NotFound("Ticket Type Not Found");

            return Ok(ticketType.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ticketTypes = await _ticketTypeService.GetAllAsync();
            return Ok(ticketTypes.Select(t => t.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TicketTypeDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");
            if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest("Name is required");

            // dto.DiscountPercent: 0..100
            if (dto.DiscountPercent < 0 || dto.DiscountPercent > 100)
                return BadRequest("DiscountPercent must be between 0 and 100");

            dto.Id = ""; 

            var created = await _ticketTypeService.AddAsync(dto.FromDto());
            return Ok(created?.ToDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] string id, [FromBody] TicketTypeDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");
            if (string.IsNullOrWhiteSpace(dto.Name)) return BadRequest("Name is required");

            if (dto.DiscountPercent < 0 || dto.DiscountPercent > 100)
                return BadRequest("DiscountPercent must be between 0 and 100");

            var existing = await _ticketTypeService.GetByIdAsync(id);
            if (existing == null) return NotFound("Ticket Type Not Found");

            dto.Id = id; 

            var updated = await _ticketTypeService.UpdateAsync(id, dto.FromDto());
            if (updated == null) return NotFound("Ticket Type Not Found");

            return Ok(updated.ToDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var existing = await _ticketTypeService.GetByIdAsync(id);
            if (existing == null) return NotFound("Ticket Type Not Found");

            await _ticketTypeService.DeleteAsync(id);
            return Ok();
        }
    }
}
