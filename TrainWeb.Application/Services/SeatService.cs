using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Services
{
    public class SeatService
    {
        private readonly ISeatRepository _seatRepo;

        public SeatService(ISeatRepository seatRepository)
        {
            _seatRepo = seatRepository;
        }

        public Task<SeatEntity?> GetByIdAsync(string tripId, string seatId)
            => _seatRepo.GetByIdAsync(tripId, seatId);

        public Task<IEnumerable<SeatEntity>> GetByTripIdAsync(string tripId)
            => _seatRepo.GetByTripIdAsync(tripId);

        public async Task<SeatEntity> AddAsync(string tripId, SeatEntity seatEntity)
        {
            if (string.IsNullOrWhiteSpace(seatEntity.Id))
                seatEntity.Id = Guid.NewGuid().ToString();

            seatEntity.TripId = tripId;

            await _seatRepo.AddAsync(tripId, seatEntity);
            return seatEntity;
        }

        public async Task<SeatEntity?> UpdateAsync(string tripId, string seatId, SeatEntity seatEntity)
        {
            var existing = await _seatRepo.GetByIdAsync(tripId, seatId);
            if (existing == null) return null;

            seatEntity.Id = seatId;
            seatEntity.TripId = tripId;

            await _seatRepo.UpdateAsync(tripId, seatId, seatEntity);
            return await _seatRepo.GetByIdAsync(tripId, seatId);
        }

        public Task DeleteAsync(string tripId, string seatId)
            => _seatRepo.DeleteAsync(tripId, seatId);

        public Task MarkSeatAsUnavailable(string tripId, string seatId)
            => _seatRepo.UpdateAvailabilityAsync(tripId, seatId, false);

        public Task MarkSeatAsAvailable(string tripId, string seatId)
            => _seatRepo.UpdateAvailabilityAsync(tripId, seatId, true);
    }
}
