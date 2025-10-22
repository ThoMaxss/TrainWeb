using System.Collections.Immutable;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enum;
using TrainWeb.Domain.Exceptions;

namespace TrainWeb.Application.Services
{
    public class PaymentService
    {
        IPaymentRepository PaymentRepository { get; }
        BookingService BookingService { get; }
        public PaymentService(IPaymentRepository paymentRepository, BookingService bookingService)
        {
            PaymentRepository = paymentRepository;
            BookingService = bookingService;
        }
       //Pao cao doanh thu
       //PT giao dich
        public async Task<Payment?> GetById(string id)
        {
            var paymentEntity = await PaymentRepository.GetByIdAsync(id);

            if(paymentEntity == null)
            {
                return null;
            }

            var booking = paymentEntity.BookingId != null 
                ? await BookingService.GetById(paymentEntity.BookingId)
                : null;

            return paymentEntity?.ToDomain(booking);
        }

        public async Task<ImmutableList<Payment>?> GetByBookingId(string bookingId)
        {
            var paymentEntities = await PaymentRepository.GetByBookingIdAsync(bookingId);

            var booking = await BookingService.GetById(bookingId);

            return paymentEntities?.Select(paymentEntity => paymentEntity.ToDomain(booking)).ToImmutableList();
        }

        public async Task<Payment?> GetPendingByBookingId(string bookingId)
        {
            var paymentEntity = await PaymentRepository.GetPendingByBookingIdAsync(bookingId);

            var booking = await BookingService.GetById(bookingId);

            return paymentEntity?.ToDomain(booking);
        }

        public async Task<ImmutableList<Payment>> GetAllAsync()
        {
            var paymentEntities = await PaymentRepository.GetAllAsync();

            return paymentEntities.Select(paymentEntity =>
            {
                var booking = paymentEntity.BookingId != null
                    ? BookingService.GetById(paymentEntity.BookingId).Result
                    : null;
                return paymentEntity.ToDomain(booking);
            }).ToImmutableList();
        }

        public async Task<ImmutableList<Payment>> GetByUserId(string userId)
        {
            var paymentEntities = await PaymentRepository.GetByUserIdAsync(userId);
            return paymentEntities?.Select(paymentEntity =>
            {
                var booking = paymentEntity.BookingId != null
                    ? BookingService.GetById(paymentEntity.BookingId).Result
                    : null;
                return paymentEntity.ToDomain(booking);
            }).ToImmutableList() ?? ImmutableList<Payment>.Empty;
        }

        public async Task<Payment?> AddAsync(Payment payment)
        {
            var booking = await BookingService.GetById(payment.Booking?.Id!);
            if (booking == null)
            {
                throw new BadRequestException("Booking Not Found");
            }

            payment.Amount = booking.Price;
            var paymentEntity = PaymentEntity.FromDomain(payment);

            await PaymentRepository.AddAsync(paymentEntity);

            return paymentEntity.ToDomain(booking);
        }

        public async Task SuccessPaymentAsync(string id)
        {
            var paymentEntity = await PaymentRepository.GetByIdAsync(id);

            if (paymentEntity == null || paymentEntity.BookingId == null)
            {
                throw new NotFoundException("Payment Or Booking Not Found");
            }
            paymentEntity.Status = PaymentStatus.Success;

            await PaymentRepository.UpdateAsync(id, paymentEntity);

            var existingBooking = await BookingService.GetById(paymentEntity.BookingId!);

            existingBooking!.Status = BookingStatus.Paid;

            var updatedBooking = await BookingService.UpdateAsync(existingBooking.Id!, existingBooking);
        }

        public async Task<Payment?> UpdateAsync(string id, Payment payment)
        {
            var paymentEntity = PaymentEntity.FromDomain(payment);
            await PaymentRepository.UpdateAsync(id, paymentEntity);
            var booking = paymentEntity.BookingId != null
                ? await BookingService.GetById(paymentEntity.BookingId)
                : null;
            return paymentEntity.ToDomain(booking);
        }

        public async Task DeleteAsync(string id)
        {
            await PaymentRepository.DeleteAsync(id);
        }
    }
}
