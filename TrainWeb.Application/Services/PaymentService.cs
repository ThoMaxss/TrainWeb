using System;
using System.Collections.Immutable;
using System.Linq;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enum;
using TrainWeb.Domain.Exceptions;

namespace TrainWeb.Application.Services
{
    public class PaymentService
    {
        private readonly IPaymentRepository _paymentRepo;
        private readonly BookingService _bookingService;

        public PaymentService(IPaymentRepository paymentRepository, BookingService bookingService)
        {
            _paymentRepo = paymentRepository;
            _bookingService = bookingService;
        }

        public async Task<Payment?> GetByIdAsync(string id)
        {
            var paymentEntity = await _paymentRepo.GetByIdAsync(id);
            if (paymentEntity == null) return null;

            var booking = paymentEntity.BookingId != null
                ? await _bookingService.GetByIdAsync(paymentEntity.BookingId)
                : null;

            return paymentEntity.ToDomain(booking);
        }

        public async Task<ImmutableList<Payment>> GetByBookingIdAsync(string bookingId)
        {
            var paymentEntities = await _paymentRepo.GetByBookingIdAsync(bookingId)
                                ?? Enumerable.Empty<PaymentEntity>();

            var booking = await _bookingService.GetByIdAsync(bookingId);

            return paymentEntities
                .Select(e => e.ToDomain(booking))
                .ToImmutableList();
        }

        public async Task<Payment?> GetPendingByBookingIdAsync(string bookingId)
        {
            var paymentEntity = await _paymentRepo.GetPendingByBookingIdAsync(bookingId);
            if (paymentEntity == null) return null;

            var booking = await _bookingService.GetByIdAsync(bookingId);
            return paymentEntity.ToDomain(booking);
        }

        public async Task<ImmutableList<Payment>> GetAllAsync()
        {
            var paymentEntities = await _paymentRepo.GetAllAsync();

            var result = ImmutableList.CreateBuilder<Payment>();
            foreach (var pe in paymentEntities)
            {
                var booking = pe.BookingId != null
                    ? await _bookingService.GetByIdAsync(pe.BookingId)
                    : null;

                result.Add(pe.ToDomain(booking));
            }

            return result.ToImmutable();
        }

        public async Task<ImmutableList<Payment>> GetByUserIdAsync(string userId)
        {
            var paymentEntities = await _paymentRepo.GetByUserIdAsync(userId)
                                ?? Enumerable.Empty<PaymentEntity>();

            var result = ImmutableList.CreateBuilder<Payment>();
            foreach (var pe in paymentEntities)
            {
                var booking = pe.BookingId != null
                    ? await _bookingService.GetByIdAsync(pe.BookingId)
                    : null;

                result.Add(pe.ToDomain(booking));
            }

            return result.ToImmutable();
        }

        public async Task<Payment> AddAsync(Payment payment)
        {
            var bookingId = !string.IsNullOrWhiteSpace(payment.BookingId)
                ? payment.BookingId
                : payment.Booking?.Id;

            if (string.IsNullOrWhiteSpace(bookingId))
                throw new BadRequestException("BookingId is required");

            var booking = await _bookingService.GetByIdAsync(bookingId);
            if (booking == null)
                throw new BadRequestException("Booking Not Found");

            payment.Amount = booking.Amount;

            var normalized = new Payment(
                id: payment.Id,
                booking: booking,
                bookingId: bookingId,
                amount: payment.Amount,
                method: payment.Method,                 
                status: payment.Status,                
                createdAt: payment.CreatedAt            
            );

            var entity = PaymentEntity.FromDomain(normalized);
            await _paymentRepo.AddAsync(entity);

            return entity.ToDomain(booking);
        }

        public async Task SuccessPaymentAsync(string paymentId)
        {
            var paymentEntity = await _paymentRepo.GetByIdAsync(paymentId);
            if (paymentEntity == null || paymentEntity.BookingId == null)
                throw new NotFoundException("Payment Or Booking Not Found");

            paymentEntity.Status = PaymentStatus.Success.ToString().ToLowerInvariant();
            await _paymentRepo.UpdateAsync(paymentId, paymentEntity);

            await _bookingService.SucceedBookingAsync(paymentEntity.BookingId);
        }

        public async Task<Payment?> UpdateAsync(string id, Payment payment)
        {
            var entity = PaymentEntity.FromDomain(payment);
            await _paymentRepo.UpdateAsync(id, entity);

            var booking = entity.BookingId != null
                ? await _bookingService.GetByIdAsync(entity.BookingId)
                : null;

            return entity.ToDomain(booking);
        }

        public Task DeleteAsync(string id)
            => _paymentRepo.DeleteAsync(id);
    }
}
