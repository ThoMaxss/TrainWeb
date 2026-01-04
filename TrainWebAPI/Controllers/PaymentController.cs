using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
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

        public PaymentController(
            PaymentService paymentService,
            IConfiguration configuration,
            MomoService momoService,
            BookingService bookingService)
        {
            PaymentService = paymentService;
            Configuration = configuration;
            MomoService = momoService;
            BookingService = bookingService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var payment = await PaymentService.GetByIdAsync(id);
            if (payment == null) return NotFound("Payment Not Found");
            return Ok(payment.ToDto());
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId([FromRoute] string userId)
        {
            var payments = await PaymentService.GetByUserIdAsync(userId);
            if (payments == null || !payments.Any()) return NotFound("Payments Not Found");
            return Ok(payments.Select(p => p.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Pay([FromBody] PaymentDto paymentDto)
        {
            var createdPayment = await PaymentService.AddAsync(paymentDto.FromDto());

            switch (createdPayment.Method)
            {
                case PaymentMethod.Momo:
                    // Gọi MoMo thật nếu đã cấu hình
                    var momoResponse = await MomoService.CreateMomoPaymentAsync(createdPayment);

                    if (momoResponse != null && momoResponse.resultCode == 0 && !string.IsNullOrWhiteSpace(momoResponse.payUrl))
                    {
                        // Frontend expect plain text URL
                        return Content(momoResponse.payUrl, "text/plain");
                    }

                    // Nếu MoMo chưa cấu hình hoặc lỗi, trả thông tin để FE hiển thị
                    var message = momoResponse?.message ?? "MoMo payment initialization failed";
                    var code = momoResponse?.resultCode ?? -1;
                    return StatusCode(StatusCodes.Status502BadGateway, new { message, resultCode = code });

                case PaymentMethod.VnPay:
                    // TODO: implement VNPay
                    return Ok(createdPayment.ToDto());

                case PaymentMethod.Visa:
                    // TODO: implement Visa
                    return Ok(createdPayment.ToDto());

                default:
                    return Ok(createdPayment.ToDto());
            }
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
            if (!VerifyMomoSignature(request))
                return BadRequest(new { message = "Invalid signature" });

            // Lưu ý: request.OrderId đang là paymentId (theo code Pay mock bạn set orderId=createdPayment.Id)
            var payment = await PaymentService.GetByIdAsync(request.OrderId);

            if (request.ResultCode == 0)
            {
                if (payment != null && payment.Status != PaymentStatus.Success)
                {
                    await PaymentService.SuccessPaymentAsync(request.OrderId);
                }
            }
            else
            {
                // Fail -> cancel booking nếu có bookingId
                var bookingId = payment?.BookingId ?? payment?.Booking?.Id;

                if (string.IsNullOrWhiteSpace(bookingId))
                    return BadRequest(new { message = "Payment or Booking not found" });

                await BookingService.CancelBookingAsync(bookingId);
            }

            return Ok(new { message = "IPN received" });
        }

        private bool VerifyMomoSignature(MomoIPNRequest request)
        {
            var secretKey = Configuration["MoMo:SecretKey"];
            if (string.IsNullOrEmpty(secretKey))
            {
                throw new InvalidOperationException("MoMo:SecretKey configuration is missing.");
            }

            var rawSignature =
                $"accessKey={Configuration["MoMo:AccessKey"]}" +
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

            var computedSignature = MomoHelper.CreateSignature(rawSignature, secretKey);

            return string.Equals(
                computedSignature?.ToLowerInvariant(),
                request.Signature?.ToLowerInvariant(),
                StringComparison.Ordinal
            );
        }
    }
}
