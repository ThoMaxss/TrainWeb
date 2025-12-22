using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Services
{
    public class TrainService
    {
        private readonly ITrainRepository _repo;

        public TrainService(ITrainRepository trainRepository)
        {
            _repo = trainRepository;
        }

        public async Task<Train?> GetByIdAsync(string id)
        {
            var entity = await _repo.GetByIdAsync(id);
            return entity?.ToDomain();
        }

        public async Task<ImmutableList<Train>> GetAllAsync()
        {
            var entities = await _repo.GetAllAsync();
            return entities.Select(e => e.ToDomain()).ToImmutableList();
        }

        public async Task<Train> AddAsync(Train train)
        {
            var id = string.IsNullOrWhiteSpace(train.Id)
                ? $"TR_{System.Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}"
                : train.Id;

            var normalized = new Train(
                id: id,
                name: train.Name,
                type: train.Type,
                createdAt: train.CreatedAt == default ? System.DateTime.UtcNow : train.CreatedAt
            );

            var entity = TrainEntity.FromDomain(normalized);
            await _repo.AddAsync(entity);

            var created = await _repo.GetByIdAsync(entity.Id);
            return (created ?? entity).ToDomain();
        }

        public async Task<Train?> UpdateAsync(string id, Train train)
        {
            var normalized = new Train(
                id: id, 
                name: train.Name,
                type: train.Type,
                createdAt: train.CreatedAt == default ? System.DateTime.UtcNow : train.CreatedAt
            );

            var entity = TrainEntity.FromDomain(normalized);
            await _repo.UpdateAsync(id, entity);

            var updated = await _repo.GetByIdAsync(id);
            return updated?.ToDomain();
        }

        public Task DeleteAsync(string id)
            => _repo.DeleteAsync(id);
    }
}
