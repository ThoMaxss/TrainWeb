using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Extensions;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Enum;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        private TicketService TicketService { get; }

        public TicketController(TicketService ticketService)
        {
            TicketService = ticketService;
        }
        ///Create/Get/List/Update/Delete ticket/ticket-type
        ///Buy ticket/Get QR code ticket
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var ticket = await TicketService.GetById(id);
            if (ticket == null) return NotFound("Ticket Not Found");
            return Ok(ticket.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tickets = await TicketService.GetAllAsync();
            return Ok(tickets.Select(ticket => ticket.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TicketDto ticketDto)
        {
            var createdTicket = await TicketService.AddAsync(ticketDto.FromDto());
            return Ok(createdTicket?.ToDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            [FromRoute] string id,
            [FromBody] TicketDto ticketDto
        )
        {
            var ticket = await TicketService.GetById(id);
            if (ticket == null)
            {
                return NotFound("Ticket Not Found");
            }
            ticketDto.Id = ticket.Id;
            var updatedTicket = await TicketService.UpdateAsync(id, ticketDto.FromDto());
            return Ok(updatedTicket?.ToDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(
            [FromRoute] string id
        )
        {
            var ticket = await TicketService.GetById(id);
            if (ticket == null)
            {
                return NotFound("Ticket Not Found");
            }
            await TicketService.DeleteAsync(id);
            return Ok();
        }

        [HttpGet("{id}/qrcode")]
        public async Task<IActionResult> GetQrCode(
            [FromRoute] string id
        )
        {
            var ticket = await TicketService.GetById(id);
            if (ticket == null)
            {
                return NotFound("Ticket Not Found");
            }

            if(ticket.Status != TicketStatus.Active)
            {
                return BadRequest("Ticket Has Been Used Or Cancelled");
            }
            var qrCodeImage = await TicketService.GetQrCodeTicket(id);
            return File(qrCodeImage, "image/png");
        }
    }
}
