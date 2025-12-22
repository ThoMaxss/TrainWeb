using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Services
{
    public class TicketTypeService
    {
        private readonly ITicketTypeRepository _repo;

        public TicketTypeService(ITicketTypeRepository ticketTypeRepository)
        {
            _repo = ticketTypeRepository;
        }

        public async Task<TicketType?> GetByIdAsync(string id)
        {
            var entity = await _repo.GetByIdAsync(id);
            return entity?.ToDomain();
        }

        public async Task<ImmutableList<TicketType>> GetAllAsync()
        {
            var entities = await _repo.GetAllAsync();
            return entities.Select(e => e.ToDomain()).ToImmutableList();
        }

        public async Task<TicketType> AddAsync(TicketType ticketType)
        {
            var id = string.IsNullOrWhiteSpace(ticketType.Id)
                ? $"TT_{System.Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}"
                : ticketType.Id;

            var normalized = new TicketType(id, ticketType.Name, ticketType.Discount);

            var entity = TicketTypeEntity.FromDomain(normalized);
            await _repo.AddAsync(entity);

            return entity.ToDomain();
        }

        public async Task<TicketType?> UpdateAsync(string id, TicketType ticketType)
        {
            var normalized = new TicketType(id, ticketType.Name, ticketType.Discount);

            var entity = TicketTypeEntity.FromDomain(normalized);
            await _repo.UpdateAsync(id, entity);

            var updated = await _repo.GetByIdAsync(id);
            return updated?.ToDomain();
        }

        public Task DeleteAsync(string id)
            => _repo.DeleteAsync(id);
    }
}
