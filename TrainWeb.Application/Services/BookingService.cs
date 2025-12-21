using System.Collections.Immutable;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Enum;
using TrainWeb.Domain.Exceptions;

namespace TrainWeb.Application.Services
{
    public class BookingService
    {
        private IBookingRepository BookingRepository { get; }
        private UserService UserService { get; }
        private TicketService TicketService { get; }
        private SeatService SeatService { get; }
        private IPaymentRepository PaymentRepository { get; }

        public BookingService(
            IBookingRepository bookingRepository, 
            UserService userService, 
            TicketService ticketService,
            SeatService seatService,
            IPaymentRepository paymentRepository)
        {
            BookingRepository = bookingRepository;
            UserService = userService;
            TicketService = ticketService;
            SeatService = seatService;
            PaymentRepository = paymentRepository;
        }

        public async Task<Booking?> GetById(string id)
        {
            var bookingEntity = await BookingRepository.GetByIdAsync(id);

            if (bookingEntity == null)
            {
                throw new NotFoundException("Book Not Found");
            }

            var user = await UserService.GetUserByIdAsync(bookingEntity.UserId);

            var ticket = await TicketService.GetById(bookingEntity.TicketId);

            return bookingEntity.ToDomain(user, ticket);
        }

        public async Task<ImmutableList<Booking>> GetAllAsync()
        {
            var bookingEntities = await BookingRepository.GetAllAsync();

            return bookingEntities.Select(bookingEntity => {
                return bookingEntity.ToDomain(null, null);
            }).ToImmutableList();
        }

        public async Task<ImmutableList<Booking>> GetByUserIdAsync(string userId)
        {
            var bookingEntities = await BookingRepository.GetByUserIdAsync(userId);

            var user = await UserService.GetUserByIdAsync(userId);

            return bookingEntities.Select(bookingEntity =>
            {
                var ticket = bookingEntity.TicketId != null
                    ? TicketService.GetById(bookingEntity.TicketId).Result
                    : null;
                return bookingEntity.ToDomain(user, ticket);
            }).ToImmutableList();
        }

        public async Task<Booking?> AddAsync(Booking booking)
        {
            var ticket = booking.Ticket?.Id != null
                ? await TicketService.GetById(booking.Ticket.Id)
                : null;

            // Check if seat is already booked
            if (ticket?.Seat?.Id != null)
            {
                // Check if seat is available
                var seat = await SeatService.GetById(ticket.Seat.Id);
                if (seat?.IsAvailable == false)
                {
                    throw new BadRequestException("Ghế này không còn khả dụng. Vui lòng chọn ghế khác.");
                }

                // Check all bookings to see if this seat is already taken
                var allBookings = await BookingRepository.GetAllAsync();
                foreach (var existingBooking in allBookings)
                {
                    if (existingBooking.Status == BookingStatus.Reserved || 
                        existingBooking.Status == BookingStatus.Paid)
                    {
                        if (existingBooking.TicketId != null)
                        {
                            var existingTicket = await TicketService.GetById(existingBooking.TicketId);
                            if (existingTicket?.Seat?.Id == ticket.Seat.Id)
                            {
                                throw new BadRequestException("Ghế này đã được đặt. Vui lòng chọn ghế khác.");
                            }
                        }
                    }
                }

                // Mark seat as unavailable
                await SeatService.MarkSeatAsUnavailable(ticket.Seat.Id);
            }

            booking.Price = ticket?.Seat?.Price - ticket?.TicketType?.Discount;
            booking.Status = BookingStatus.Reserved;
            var bookingEntity = BookingEntity.FromDomain(booking);
            await BookingRepository.AddAsync(bookingEntity);

            var user = bookingEntity.UserId != null
                ? await UserService.GetUserByIdAsync(bookingEntity.UserId)
                : null;
            

            return bookingEntity.ToDomain(user, ticket);
        }

        public async Task<Booking?> UpdateAsync(string id, Booking booking)
        {
            var bookingEntity = BookingEntity.FromDomain(booking);
            await BookingRepository.UpdateAsync(id, bookingEntity);

            var user = bookingEntity.UserId != null
                ? await UserService.GetUserByIdAsync(bookingEntity.UserId)
                : null;
            var ticket = bookingEntity.TicketId != null
                ? await TicketService.GetById(bookingEntity.TicketId)
                : null;
            return bookingEntity.ToDomain(user, ticket);
        }

        public async Task SucceedBookingAsync(string id)
        {
            var bookingEntity = await BookingRepository.GetByIdAsync(id);
            if (bookingEntity == null)
            {
                throw new NotFoundException("Booking Not Found");
            }
            bookingEntity.Status = BookingStatus.Paid;
            await BookingRepository.UpdateAsync(id, bookingEntity);

            var payment = await PaymentRepository.GetPendingByBookingIdAsync(id);
            if(payment != null)
            {
                payment.Status = PaymentStatus.Success;
                await PaymentRepository.UpdateAsync(payment.Id, payment);
            }

        }

        public async Task CancelledBookingAsync(string id)
        {
            var bookingEntity = await BookingRepository.GetByIdAsync(id);
            if (bookingEntity == null)
            {
                throw new NotFoundException("Booking Not Found");
            }

            // Release the seat
            if (bookingEntity.TicketId != null)
            {
                var ticket = await TicketService.GetById(bookingEntity.TicketId);
                if (ticket?.Seat?.Id != null)
                {
                    await SeatService.MarkSeatAsAvailable(ticket.Seat.Id);
                }
            }

            bookingEntity.Status = BookingStatus.Cancelled;
            await BookingRepository.UpdateAsync(id, bookingEntity);

            var payment = await PaymentRepository.GetPendingByBookingIdAsync(id);
            if (payment != null)
            {
                payment.Status = PaymentStatus.Failed;
                await PaymentRepository.UpdateAsync(payment.Id, payment);
            }

        }
    }
}
