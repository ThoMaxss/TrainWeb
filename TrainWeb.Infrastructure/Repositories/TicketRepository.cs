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
    public class TicketRepository : FirestoreRepository<TicketEntity>, ITicketRepository
    {
        private const string CollectionName = "Tickets";

        public TicketRepository(FirestoreDbContext context) : base(context) { }

        public async Task<TicketEntity?> GetByIdAsync(string id)
        {
            return await GetByIdAsync(CollectionName, id);
        }

        public async Task<IEnumerable<TicketEntity>> GetAllAsync()
        {
            return await GetAllAsync(CollectionName);
        }

        public async Task AddAsync(TicketEntity ticketEntity)
        {
            await AddAsync(CollectionName, ticketEntity.Id, ticketEntity);
        }

        public async Task UpdateAsync(string id, TicketEntity ticketEntity)
        {
            await UpdateAsync(CollectionName, id, ticketEntity);
        }

        public async Task DeleteAsync(string id)
        {
            await DeleteAsync(CollectionName, id);
        }
    }
}
