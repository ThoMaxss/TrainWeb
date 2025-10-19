using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Application.Interfaces
{
    public interface ITicketRepository : IRepository<TicketEntity>
    {
        Task<TicketEntity?> GetByIdAsync(string id);
        Task<IEnumerable<TicketEntity>> GetAllAsync();
        Task AddAsync(TicketEntity ticketEntity);
        Task UpdateAsync(string id, TicketEntity ticketEntity);
        Task DeleteAsync(string id);
    }
}
