using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enum;
using TrainWeb.Domain.Exceptions;

namespace TrainWeb.Application.Services
{
    public class BookingService
    {
        private readonly IBookingRepository _bookingRepo;
        private readonly SeatService _seatService;
        private readonly IPaymentRepository _paymentRepo;
        private readonly TicketService _ticketService;
        private readonly TicketTypeService _ticketTypeService; 
        public BookingService(
            IBookingRepository bookingRepo,
            SeatService seatService,
            IPaymentRepository paymentRepo,
            TicketService ticketService,
            TicketTypeService ticketTypeService 
        )
        {
            _bookingRepo = bookingRepo;
            _seatService = seatService;
            _paymentRepo = paymentRepo;
            _ticketService = ticketService;
            _ticketTypeService = ticketTypeService;
        }

        public async Task<Booking?> GetByIdAsync(string id)
        {
            var entity = await _bookingRepo.GetByIdAsync(id);
            if (entity == null) throw new NotFoundException("Booking Not Found");
            return entity.ToDomain();
        }

        public async Task<IReadOnlyList<Booking>> GetAllAsync()
        {
            var entities = await _bookingRepo.GetAllAsync();
            return entities.Select(e => e.ToDomain()).ToList();
        }

        public async Task<IReadOnlyList<Booking>> GetByUserIdAsync(string userId)
        {
            var entities = await _bookingRepo.GetByUserIdAsync(userId);
            return entities.Select(e => e.ToDomain()).ToList();
        }

        public async Task<Booking> CreateAsync(string userId, string tripId, string seatId, string? ticketTypeId)
        {
            var seat = await _seatService.GetByIdAsync(tripId, seatId);
            if (seat == null) throw new NotFoundException("Seat Not Found");
            if (seat.IsAvailable == false)
                throw new BadRequestException("Ghế không còn khả dụng.");

            var active = await _bookingRepo.GetActiveBookingsByTripSeatAsync(tripId, seatId);
            if (active.Any())
                throw new BadRequestException("Ghế này đã được đặt.");

            //base amount lấy từ seat.Price
            var baseAmount = seat.Price;

            //áp discount nếu có ticketTypeId
            double finalAmount = baseAmount;
            if (!string.IsNullOrWhiteSpace(ticketTypeId))
            {
                var type = await _ticketTypeService.GetByIdAsync(ticketTypeId);
                if (type == null) throw new NotFoundException("TicketType Not Found");

                // type.Discount: 0.1 = 10%
                finalAmount = baseAmount * (1 - type.Discount);
            }

            var booking = new Booking(
                id: null,
                userId: userId,
                tripId: tripId,
                seatId: seatId,
                ticketTypeId: ticketTypeId,             
                amount: finalAmount,                    
                status: BookingStatus.Reserved,
                paymentStatus: PaymentStatus.Pending,
                paymentId: null,
                ticketId: null,
                ticketStatus: null,
                createdAt: DateTime.UtcNow,
                expiresAt: DateTime.UtcNow.AddMinutes(15)
            );

            booking.SeatSummary = new Dictionary<string, object>
            {
                { "seatNumber", seat.SeatNumber ?? "" },
                { "type", seat.Type.ToString() },
                { "price", seat.Price }
            };

            var entity = BookingEntity.FromDomain(booking);
            await _bookingRepo.AddAsync(entity);

            await _seatService.MarkSeatAsUnavailable(tripId, seatId);

            return entity.ToDomain();
        }

        public async Task SucceedBookingAsync(string bookingId)
        {
            var entity = await _bookingRepo.GetByIdAsync(bookingId);
            if (entity == null) throw new NotFoundException("Booking Not Found");

            // idempotent
            if (string.Equals(entity.Status, "paid", StringComparison.OrdinalIgnoreCase))
                return;

            entity.Status = BookingStatus.Paid.ToString().ToLowerInvariant();           // "paid"
            entity.PaymentStatus = PaymentStatus.Success.ToString().ToLowerInvariant(); // "success"
            await _bookingRepo.UpdateAsync(bookingId, entity);

            var payment = await _paymentRepo.GetPendingByBookingIdAsync(bookingId);
            if (payment != null)
            {
                payment.Status = PaymentStatus.Success.ToString().ToLowerInvariant();   // "success"
                await _paymentRepo.UpdateAsync(payment.Id, payment);
            }

            // ✅ tạo ticket sau khi thanh toán thành công
            var ticket = await _ticketService.CreateForBookingAsync(bookingId);

            entity.TicketId = ticket.Id;
            entity.TicketStatus = ticket.Status.ToString().ToLowerInvariant();          // "active"
            await _bookingRepo.UpdateAsync(bookingId, entity);
        }

        public async Task CancelBookingAsync(string bookingId)
        {
            var entity = await _bookingRepo.GetByIdAsync(bookingId);
            if (entity == null) throw new NotFoundException("Booking Not Found");

            await _seatService.MarkSeatAsAvailable(entity.TripId, entity.SeatId);

            entity.Status = BookingStatus.Cancelled.ToString().ToLowerInvariant();       // "cancelled"
            entity.PaymentStatus = PaymentStatus.Failed.ToString().ToLowerInvariant();   // "failed"
            await _bookingRepo.UpdateAsync(bookingId, entity);

            var payment = await _paymentRepo.GetPendingByBookingIdAsync(bookingId);
            if (payment != null)
            {
                payment.Status = PaymentStatus.Failed.ToString().ToLowerInvariant();     // "failed"
                await _paymentRepo.UpdateAsync(payment.Id, payment);
            }
        }
    }
}
