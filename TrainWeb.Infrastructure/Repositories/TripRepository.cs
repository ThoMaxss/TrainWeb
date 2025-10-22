using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Entities.TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Infrastructure.Repositories
{
    public class TripRepository : FirestoreRepository<TripEntity>, ITripRepository
    {
        private const string CollectionName = "Trips";

        public TripRepository(FirestoreDbContext context) : base(context) { }

        public async Task<TripEntity?> GetByIdAsync(string id)
        {
            return await GetByIdAsync(CollectionName, id);
        }

        public async Task<IEnumerable<TripEntity>> GetAllAsync()
        {
            return await GetAllAsync(CollectionName);
        }

        public async Task AddAsync(TripEntity tripEntity)
        {
            await AddAsync(CollectionName, tripEntity.Id, tripEntity);
        }

        public async Task UpdateAsync(string id, TripEntity tripEntity)
        {
            await UpdateAsync(CollectionName, id, tripEntity);
        }

        public async Task DeleteAsync(string id)
        {
            await DeleteAsync(CollectionName, id);
        }
    }
}
