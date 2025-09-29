using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Interfaces
{
    public interface IBookingRepository
    {
        Task<Booking?> GetByIdAsync(string id);
        Task<IEnumerable<Booking>> GetByUserIdAsync(string userId);
        Task AddAsync(Booking booking);
        Task UpdateAsync(Booking booking);
        Task DeleteAsync(string id);
    }
}
