using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public class TicketTypeRepository : FirestoreRepository<TicketTypeEntity>, ITicketTypeRepository
    {
        private const string CollectionName = "TicketTypes";

        public TicketTypeRepository(FirestoreDbContext context) : base(context) { }

        public async Task<TicketTypeEntity?> GetByIdAsync(string id)
        {
            return await GetByIdAsync(CollectionName, id);
        }

        public async Task<IEnumerable<TicketTypeEntity>> GetAllAsync()
        {
            return await GetAllAsync(CollectionName);
        }

        public async Task AddAsync(TicketTypeEntity ticketTypeEntity)
        {
            await AddAsync(CollectionName, ticketTypeEntity.Id, ticketTypeEntity);
        }

        public async Task UpdateAsync(string id, TicketTypeEntity ticketTypeEntity)
        {
            await UpdateAsync(CollectionName, id, ticketTypeEntity);
        }

        public async Task DeleteAsync(string id)
        {
            await DeleteAsync(CollectionName, id);
        }
    }
}
