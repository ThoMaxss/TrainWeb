using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public class TrainRepository : FirestoreRepository<TrainEntity>, ITrainRepository
    {
        private const string CollectionName = "trains";

        public TrainRepository(FirestoreDbContext context) : base(context) { }

        public Task<TrainEntity?> GetByIdAsync(string id)
            => GetByIdAsync(CollectionName, id);

        public Task<IEnumerable<TrainEntity>> GetAllAsync()
            => GetAllAsync(CollectionName);

        public async Task AddAsync(TrainEntity trainEntity)
        {
            if (string.IsNullOrWhiteSpace(trainEntity.Id))
                trainEntity.Id = Guid.NewGuid().ToString();

            await AddAsync(CollectionName, trainEntity.Id, trainEntity);
        }

        public Task UpdateAsync(string id, TrainEntity trainEntity)
        {
            trainEntity.Id = id;
            return UpdateAsync(CollectionName, id, trainEntity);
        }

        public Task DeleteAsync(string id)
            => DeleteAsync(CollectionName, id);
    }
}
