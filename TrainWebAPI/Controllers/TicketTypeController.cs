using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Extensions;
using TrainWeb.Application.Services;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketTypeController : ControllerBase
    {
        private TicketTypeService TicketTypeService { get; }

        public TicketTypeController(TicketTypeService ticketTypeService)
        {
            TicketTypeService = ticketTypeService;
        }
        ///Create/Get/List/Update/Delete ticket/ticket-type
        ///Buy ticket/Get QR code ticket
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var ticketType = await TicketTypeService.GetById(id);
            if (ticketType == null) return NotFound("Ticket Type Not Found");
            return Ok(ticketType.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ticketTypes = await TicketTypeService.GetAllAsync();
            return Ok(ticketTypes.Select(ticketType => ticketType.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TicketTypeDto ticketTypeDto)
        {
            var createdTicketType = await TicketTypeService.AddAsync(ticketTypeDto.FromDto());
            return Ok(createdTicketType?.ToDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            [FromRoute] string id,
            [FromBody] TicketTypeDto ticketTypeDto
        )
        {
            var ticketType = await TicketTypeService.GetById(id);
            if (ticketType == null)
            {
                return NotFound("Ticket Type Not Found");
            }
            ticketTypeDto.Id = ticketType.Id;
            var updatedTicketType = await TicketTypeService.UpdateAsync(id, ticketTypeDto.FromDto());
            return Ok(updatedTicketType?.ToDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(
            [FromRoute] string id
        )
        {
            var ticketType = await TicketTypeService.GetById(id);
            if (ticketType == null)
            {
                return NotFound("Ticket Type Not Found");
            }
            await TicketTypeService.DeleteAsync(id);
            return Ok();
        }
    }
}
