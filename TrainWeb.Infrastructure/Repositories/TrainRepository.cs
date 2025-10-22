using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public class TrainRepository : FirestoreRepository<TrainEntity>, ITrainRepository
    {
        private const string CollectionName = "Trains";

        public TrainRepository(FirestoreDbContext context) : base(context) { }

        public async Task<TrainEntity?> GetByIdAsync(string id)
        {
            return await GetByIdAsync(CollectionName, id);
        }

        public async Task<IEnumerable<TrainEntity>> GetAllAsync()
        {
            return await GetAllAsync(CollectionName);
        }

        public async Task AddAsync(TrainEntity trainEntity)
        {
            await AddAsync(CollectionName, trainEntity.Id, trainEntity);
        }

        public async Task UpdateAsync(string id, TrainEntity trainEntity)
        {
            await UpdateAsync(CollectionName, id, trainEntity);
        }

        public async Task DeleteAsync(string id)
        {
            await DeleteAsync(CollectionName, id);
        }
    }
}
