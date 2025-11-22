using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Infrastructure.Repositories
{
    public class SeatRepository : FirestoreRepository<SeatEntity>, ISeatRepository
    {
        private const string CollectionName = "Seats";

        public SeatRepository(FirestoreDbContext context) : base(context) { }

        public async Task<SeatEntity?> GetByIdAsync(string id)
        {
            return await GetByIdAsync(CollectionName, id);
        }

        public async Task<IEnumerable<SeatEntity>> GetAllAsync()
        {
            return await GetAllAsync(CollectionName);
        }

        public async Task<IEnumerable<SeatEntity>> GetByTripIdAsync(string tripId)
        {
            var allSeats = await GetAllAsync(CollectionName);
            return allSeats.Where(s => s.TripId == tripId);
        }

        public async Task AddAsync(SeatEntity seatEntity)
        {
            await AddAsync(CollectionName, seatEntity.Id, seatEntity);
        }

        public async Task UpdateAsync(string id, SeatEntity seatEntity)
        {
            await UpdateAsync(CollectionName, id, seatEntity);
        }

        public async Task DeleteAsync(string id)
        {
            await DeleteAsync(CollectionName, id);
        }
    }
}
