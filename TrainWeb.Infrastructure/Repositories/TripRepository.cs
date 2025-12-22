using System.Collections.Generic;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public class TripRepository : FirestoreRepository<TripEntity>, ITripRepository
    {
        private const string CollectionName = "trips";

        public TripRepository(FirestoreDbContext context) : base(context) { }

        public Task<TripEntity?> GetByIdAsync(string id)
            => GetByIdAsync(CollectionName, id);

        public Task<IEnumerable<TripEntity>> GetAllAsync()
            => GetAllAsync(CollectionName);

        public Task AddAsync(TripEntity tripEntity)
        {
            if (string.IsNullOrWhiteSpace(tripEntity.Id))
                tripEntity.Id = Guid.NewGuid().ToString();

            return AddAsync(CollectionName, tripEntity.Id, tripEntity);
        }

        public Task UpdateAsync(string id, TripEntity tripEntity)
            => UpdateAsync(CollectionName, id, tripEntity);

        public Task DeleteAsync(string id)
            => DeleteAsync(CollectionName, id);
    }
}
