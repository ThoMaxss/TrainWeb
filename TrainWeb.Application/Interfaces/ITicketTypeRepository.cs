using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Application.Interfaces
{
    public interface ITicketTypeRepository : IRepository<TicketTypeEntity>
    {
        Task<TicketTypeEntity?> GetByIdAsync(string id);
        Task<IEnumerable<TicketTypeEntity>> GetAllAsync();
        Task<IEnumerable<TicketTypeEntity>> GetActiveAsync();
        Task AddAsync(TicketTypeEntity ticketTypeEntity);
        Task UpdateAsync(string id, TicketTypeEntity ticketTypeEntity);
        Task DeleteAsync(string id);
    }
}
