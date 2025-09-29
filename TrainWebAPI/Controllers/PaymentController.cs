using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public PaymentController(PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("pay")]
        public async Task<IActionResult> Pay([FromBody] Payment payment)
        {
            await _paymentService.AddAsync(payment);
            return Ok(payment);
        }
    }
}
