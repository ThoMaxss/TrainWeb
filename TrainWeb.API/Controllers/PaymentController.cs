using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrainWeb.Application.DTOs;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enums;
using TrainWeb.Infrastructure.Data;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(ApplicationDbContext context, ILogger<PaymentController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Create payment for booking
        /// </summary>
        [HttpPost("create")]
        public async Task<ActionResult<PaymentDto>> CreatePayment([FromBody] PaymentRequestDto request)
        {
            try
            {
                _logger.LogInformation("Creating payment for booking {BookingId}, Method: {Method}", 
                    request.BookingId, request.Method);

                // 1. Validate booking exists
                var booking = await _context.Bookings
                    .Include(b => b.Trip)
                    .FirstOrDefaultAsync(b => b.Id == request.BookingId);

                if (booking == null)
                {
                    return BadRequest(new { error = "Booking not found" });
                }

                // 2. Validate booking is pending
                if (booking.Status != BookingStatus.Pending)
                {
                    return BadRequest(new { error = "Booking is not in pending status" });
                }

                // 3. Validate amount matches booking final amount
                if (decimal.Parse(request.Amount) != decimal.Parse(booking.FinalAmount))
                {
                    return BadRequest(new { 
                        error = "Payment amount does not match booking amount",
                        expectedAmount = booking.FinalAmount,
                        providedAmount = request.Amount
                    });
                }

                // 4. Validate payment method is supported
                if (!Enum.TryParse<PaymentMethod>(request.Method, true, out var method))
                {
                    return BadRequest(new { error = "Unsupported payment method" });
                }

                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        // 5. Create payment record
                        var payment = new Payment
                        {
                            Id = Guid.NewGuid().ToString(),
                            BookingId = request.BookingId,
                            UserId = booking.UserId,
                            Amount = request.Amount,
                            Method = method,
                            Status = PaymentStatus.Pending,
                            TransactionReference = GenerateTransactionReference(),
                            CardLastFourDigits = request.CardLastFourDigits,
                            CardHolderName = request.CardHolderName,
                            BankCode = request.BankCode,
                            IPAddress = GetClientIpAddress(),
                            CreatedAt = DateTime.UtcNow,
                            RetryCount = 0
                        };

                        _context.Payments.Add(payment);

                        // 6. Process payment based on method
                        var (success, gatewayResponse, failureReason) = await ProcessPayment(payment, request);

                        if (success)
                        {
                            payment.Status = PaymentStatus.Completed;
                            payment.ProcessedAt = DateTime.UtcNow;
                            payment.GatewayResponse = gatewayResponse;

                            // 7. Update booking status to paid
                            booking.Status = BookingStatus.Paid;
                            booking.PaidAt = DateTime.UtcNow;
                            booking.PaymentId = payment.Id;
                            _context.Bookings.Update(booking);

                            _logger.LogInformation("Payment {PaymentId} processed successfully for booking {BookingId}", 
                                payment.Id, booking.Id);
                        }
                        else
                        {
                            payment.Status = PaymentStatus.Failed;
                            payment.FailureReason = failureReason;
                            payment.GatewayResponse = gatewayResponse;
                            payment.RetryCount = 1;

                            _logger.LogWarning("Payment {PaymentId} failed: {Reason}", payment.Id, failureReason);
                        }

                        _context.Payments.Update(payment);
                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        return Ok(new PaymentDto
                        {
                            Id = payment.Id,
                            BookingId = payment.BookingId,
                            Amount = payment.Amount,
                            Method = payment.Method.ToString(),
                            Status = payment.Status.ToString(),
                            TransactionReference = payment.TransactionReference,
                            ProcessedAt = payment.ProcessedAt,
                            FailureReason = payment.FailureReason
                        });
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        _logger.LogError(ex, "Error creating payment");
                        throw;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in CreatePayment");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get payment details
        /// </summary>
        [HttpGet("{paymentId}")]
        public async Task<ActionResult<PaymentDto>> GetPayment(string paymentId)
        {
            try
            {
                var payment = await _context.Payments.FindAsync(paymentId);
                if (payment == null)
                {
                    return NotFound(new { error = "Payment not found" });
                }

                return Ok(new PaymentDto
                {
                    Id = payment.Id,
                    BookingId = payment.BookingId,
                    Amount = payment.Amount,
                    Method = payment.Method.ToString(),
                    Status = payment.Status.ToString(),
                    TransactionReference = payment.TransactionReference,
                    ProcessedAt = payment.ProcessedAt,
                    CardLastFourDigits = payment.CardLastFourDigits
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payment");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Get booking payments
        /// </summary>
        [HttpGet("booking/{bookingId}")]
        public async Task<ActionResult<List<PaymentDto>>> GetBookingPayments(string bookingId)
        {
            try
            {
                var payments = await _context.Payments
                    .Where(p => p.BookingId == bookingId)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                var result = payments.Select(p => new PaymentDto
                {
                    Id = p.Id,
                    BookingId = p.BookingId,
                    Amount = p.Amount,
                    Method = p.Method.ToString(),
                    Status = p.Status.ToString(),
                    TransactionReference = p.TransactionReference,
                    ProcessedAt = p.ProcessedAt
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching booking payments");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        /// <summary>
        /// Retry failed payment
        /// </summary>
        [HttpPost("{paymentId}/retry")]
        public async Task<ActionResult<object>> RetryPayment(string paymentId)
        {
            try
            {
                var payment = await _context.Payments
                    .Include(p => p.Booking)
                    .FirstOrDefaultAsync(p => p.Id == paymentId);

                if (payment == null)
                {
                    return NotFound(new { error = "Payment not found" });
                }

                if (payment.Status != PaymentStatus.Failed)
                {
                    return BadRequest(new { error = "Only failed payments can be retried" });
                }

                if (payment.RetryCount >= 3)
                {
                    return BadRequest(new { error = "Maximum retry attempts exceeded" });
                }

                // Retry payment processing
                var request = new PaymentRequestDto
                {
                    BookingId = payment.BookingId,
                    Amount = payment.Amount,
                    Method = payment.Method.ToString(),
                    CardLastFourDigits = payment.CardLastFourDigits,
                    CardHolderName = payment.CardHolderName,
                    BankCode = payment.BankCode
                };

                var (success, gatewayResponse, failureReason) = await ProcessPayment(payment, request);

                if (success)
                {
                    payment.Status = PaymentStatus.Completed;
                    payment.ProcessedAt = DateTime.UtcNow;
                    payment.GatewayResponse = gatewayResponse;

                    payment.Booking.Status = BookingStatus.Paid;
                    payment.Booking.PaidAt = DateTime.UtcNow;

                    _logger.LogInformation("Payment {PaymentId} retry successful", paymentId);
                }
                else
                {
                    payment.RetryCount++;
                    payment.FailureReason = failureReason;
                }

                _context.Payments.Update(payment);
                if (payment.Booking != null)
                    _context.Bookings.Update(payment.Booking);

                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = success ? "Payment retry successful" : "Payment retry failed",
                    status = payment.Status.ToString(),
                    retryCount = payment.RetryCount
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrying payment");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        private async Task<(bool success, string gatewayResponse, string failureReason)> ProcessPayment(
            Payment payment, PaymentRequestDto request)
        {
            // Simulate payment gateway processing
            // In production, integrate with actual payment gateways: Momo, VnPay, Stripe, etc.

            switch (payment.Method)
            {
                case PaymentMethod.Momo:
                    return await ProcessMomoPayment(payment, request);

                case PaymentMethod.VnPay:
                    return await ProcessVnPayPayment(payment, request);

                case PaymentMethod.Card:
                    return await ProcessCardPayment(payment, request);

                case PaymentMethod.BankTransfer:
                    return await ProcessBankTransferPayment(payment, request);

                default:
                    return (false, "", "Unsupported payment method");
            }
        }

        private async Task<(bool, string, string)> ProcessMomoPayment(Payment payment, PaymentRequestDto request)
        {
            // Simulate Momo payment processing
            await Task.Delay(100); // Simulate network delay

            // In production: call Momo API with payment.Amount, payment.TransactionReference
            bool success = new Random().Next(0, 100) > 10; // 90% success rate

            if (success)
            {
                return (true, $"MOMO-{Guid.NewGuid().ToString().Substring(0, 8)}", "");
            }
            else
            {
                return (false, "", "Momo payment gateway temporarily unavailable");
            }
        }

        private async Task<(bool, string, string)> ProcessVnPayPayment(Payment payment, PaymentRequestDto request)
        {
            // Simulate VnPay payment processing
            await Task.Delay(150);

            bool success = new Random().Next(0, 100) > 5; // 95% success rate

            if (success)
            {
                return (true, $"VNPAY-{Guid.NewGuid().ToString().Substring(0, 8)}", "");
            }
            else
            {
                return (false, "", "VnPay transaction declined");
            }
        }

        private async Task<(bool, string, string)> ProcessCardPayment(Payment payment, PaymentRequestDto request)
        {
            // Simulate card payment processing
            await Task.Delay(200);

            // Validate card number format (basic)
            if (string.IsNullOrEmpty(request.CardLastFourDigits) || request.CardLastFourDigits.Length != 4)
            {
                return (false, "", "Invalid card details");
            }

            bool success = new Random().Next(0, 100) > 15; // 85% success rate

            if (success)
            {
                return (true, $"CARD-{Guid.NewGuid().ToString().Substring(0, 8)}", "");
            }
            else
            {
                return (false, "", "Card transaction declined by issuing bank");
            }
        }

        private async Task<(bool, string, string)> ProcessBankTransferPayment(Payment payment, PaymentRequestDto request)
        {
            // Simulate bank transfer processing
            // In production: verify transfer receipt from bank
            await Task.Delay(300);

            return (true, $"BANK-{Guid.NewGuid().ToString().Substring(0, 8)}", "");
        }

        private string GenerateTransactionReference()
        {
            return $"TXN{DateTime.UtcNow:yyyyMMddHHmmss}{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
        }

        private string GetClientIpAddress()
        {
            // Get actual IP address from request
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            return ipAddress;
        }
    }

    public class PaymentRequestDto
    {
        public string BookingId { get; set; }
        public string Amount { get; set; }
        public string Method { get; set; } // Momo, VnPay, Card, BankTransfer
        public string? CardLastFourDigits { get; set; }
        public string? CardHolderName { get; set; }
        public string? BankCode { get; set; }
    }
}
