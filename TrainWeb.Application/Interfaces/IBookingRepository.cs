using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Application.Interfaces
{
    public interface IBookingRepository : IRepository<BookingEntity>
    {
        Task<BookingEntity?> GetByIdAsync(string id);
        Task<IEnumerable<BookingEntity>> GetAllAsync();
        Task<IEnumerable<BookingEntity>> GetByUserIdAsync(string userId);
        Task<IEnumerable<BookingEntity>> GetActiveBookingsBySeatIdAsync(string seatId);
        Task<IEnumerable<BookingEntity>> GetActiveBookingsByTicketIdAsync(string ticketId);
        Task AddAsync(BookingEntity bookingEntity);
        Task UpdateAsync(string id, BookingEntity bookingEntity);
        Task DeleteAsync(string id);
    }
}
