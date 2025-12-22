using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Enum;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly TicketService _ticketService;

        public TicketController(TicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var ticket = await _ticketService.GetByIdAsync(id);
            if (ticket == null) return NotFound("Ticket Not Found");

            return Ok(ticket.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tickets = await _ticketService.GetAllAsync();
            return Ok(tickets.Select(t => t.ToDto()));
        }

        // GET /api/ticket/booking/{bookingId}
        [HttpGet("booking/{bookingId}")]
        public async Task<IActionResult> GetByBookingId([FromRoute] string bookingId)
        {
            var tickets = await _ticketService.GetByBookingIdAsync(bookingId);
            return Ok(tickets.Select(t => t.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TicketDto ticketDto)
        {
            var created = await _ticketService.AddAsync(ticketDto.FromDto());
            return Ok(created.ToDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] string id, [FromBody] TicketDto ticketDto)
        {
            var existing = await _ticketService.GetByIdAsync(id);
            if (existing == null) return NotFound("Ticket Not Found");

            ticketDto.Id = id;
            var updated = await _ticketService.UpdateAsync(id, ticketDto.FromDto());
            if (updated == null) return NotFound("Ticket Not Found");

            return Ok(updated.ToDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var existing = await _ticketService.GetByIdAsync(id);
            if (existing == null) return NotFound("Ticket Not Found");

            await _ticketService.DeleteAsync(id);
            return Ok();
        }

        // Mark used
        [HttpPost("{id}/use")]
        public async Task<IActionResult> Use([FromRoute] string id)
        {
            await _ticketService.UsedTicketAsync(id);
            return Ok();
        }

        // Mark cancelled
        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> Cancel([FromRoute] string id)
        {
            await _ticketService.CancelledTicketAsync(id);
            return Ok();
        }

        [HttpGet("{id}/qrcode")]
        public async Task<IActionResult> GetQrCode([FromRoute] string id)
        {
            var ticket = await _ticketService.GetByIdAsync(id);
            if (ticket == null) return NotFound("Ticket Not Found");

            if (ticket.Status != TicketStatus.Active)
                return BadRequest("Ticket Has Been Used Or Cancelled");

            var qrBytes = await _ticketService.GetQrCodeTicket(id);
            return File(qrBytes, "image/png");
        }
    }
}
