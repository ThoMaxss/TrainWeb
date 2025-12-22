using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

public interface IBookingRepository : IRepository<BookingEntity>
{
    Task<BookingEntity?> GetByIdAsync(string id);
    Task<IEnumerable<BookingEntity>> GetAllAsync();
    Task<IEnumerable<BookingEntity>> GetByUserIdAsync(string userId);

    Task<IEnumerable<BookingEntity>> GetActiveBookingsByTripSeatAsync(string tripId, string seatId);

    Task AddAsync(BookingEntity bookingEntity);
    Task UpdateAsync(string id, BookingEntity bookingEntity);
    Task DeleteAsync(string id);
}
