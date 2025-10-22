using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Enum;
using TrainWeb.Infrastructure.Repositories;
using TrainWeb.Infrastructure.Services.Momo;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private PaymentService PaymentService { get; }
        private MomoService MomoService { get; }
        private BookingService BookingService { get; }
        private IConfiguration Configuration { get; }

        public PaymentController(PaymentService paymentService, IConfiguration configuration, MomoService momoService, BookingService bookingService)
        {
            PaymentService = paymentService;
            Configuration = configuration;
            MomoService = momoService;
            BookingService = bookingService;
        }
        //1 api xac nhan thanh toan
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var payment = await PaymentService.GetById(id);
            if (payment == null) return NotFound("Payment Not Found");
            return Ok(payment.ToDto());
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId([FromRoute] string userId)
        {
            var payments = await PaymentService.GetByUserId(userId);
            if (payments == null || !payments.Any()) return NotFound("Payments Not Found");
            return Ok(payments.Select(payment => payment.ToDto()));
        }

        [HttpPost()]
        public async Task<IActionResult> Pay([FromBody] PaymentDto paymentDto)
        {
            var createdPayment = await PaymentService.AddAsync(paymentDto.FromDto());

            if (createdPayment == null) return BadRequest("Payment Not Created");

            switch (createdPayment.Method)
            {
                case PaymentMethod.Momo:
                    var response = await MomoService.CreateMomoPaymentAsync(createdPayment);
                    if(response.resultCode != 0)
                    {
                        return BadRequest("Payment Not Created");
                    }    
                    return Ok(response.payUrl);
                case PaymentMethod.VnPay:
                    break;
                case PaymentMethod.Visa:
                    break;
                default:
                    return Ok(createdPayment.ToDto());
            }

            return Ok(createdPayment?.ToDto());
        }

        [HttpPost("{id}/success")]
        public async Task<IActionResult> SuccessPayment([FromRoute] string id)
        {
            await PaymentService.SuccessPaymentAsync(id);
            return Ok();
        }

        [HttpPost("momo/ipn")]
        public async Task<IActionResult> ReceiveMomoIPN([FromBody] MomoIPNRequest request)
        {
            if(VerifyMomoSignature(request) == false)
            {
                return BadRequest(new { message = "Invalid signature" });
            }
            if (request.ResultCode == 0)
            {
                var payment = await PaymentService.GetById(request.OrderId);
                if (payment != null && payment.Status != PaymentStatus.Success)
                {
                    await PaymentService.SuccessPaymentAsync(request.OrderId);
                }
            }
            else
            {
                var payment = await PaymentService.GetById(request.OrderId);
                if (payment == null || payment.Booking.Id == null)
                {
                    return BadRequest(new { message = "Payment or Booking not found" });
                }

                await BookingService.CancelledBookingAsync(payment.Booking.Id);
            }

            return Ok(new { message = "IPN received" });
        }

        private bool VerifyMomoSignature(MomoIPNRequest request)
        {
            var rawSignature = $"accessKey={Configuration["MoMo:AccessKey"]}" +
                $"&amount={request.Amount}" +
                $"&extraData={request.ExtraData}" +
                $"&message={request.Message}" +
                $"&orderId={request.OrderId}" +
                $"&orderInfo={request.OrderInfo}" +
                $"&orderType={request.OrderType}" +
                $"&partnerCode={request.PartnerCode}" +
                $"&payType={request.PayType}" +
                $"&requestId={request.RequestId}" +
                $"&responseTime={request.ResponseTime}" +
                $"&resultCode={request.ResultCode}";

            
            var computedSignature = MomoHelper.CreateSignature(rawSignature, Configuration["MoMo:SecretKey"]);
            return computedSignature == request.Signature.ToLower();
        }
    }
}
