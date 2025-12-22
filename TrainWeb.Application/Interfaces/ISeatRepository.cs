using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Interfaces
{
    public interface ISeatRepository
    {
        Task<SeatEntity?> GetByIdAsync(string tripId, string seatId);
        Task<IEnumerable<SeatEntity>> GetByTripIdAsync(string tripId);

        Task AddAsync(string tripId, SeatEntity seatEntity);
        Task UpdateAsync(string tripId, string seatId, SeatEntity seatEntity);
        Task DeleteAsync(string tripId, string seatId);

        Task UpdateAvailabilityAsync(string tripId, string seatId, bool isAvailable);
    }
}
