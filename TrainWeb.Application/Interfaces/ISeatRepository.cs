using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Application.Interfaces
{
    public interface ISeatRepository : IRepository<SeatEntity>
    {
        Task<SeatEntity?> GetByIdAsync(string id);
        Task<IEnumerable<SeatEntity>> GetAllAsync();
        Task AddAsync(SeatEntity seatEntity);
        Task UpdateAsync(string id, SeatEntity seatEntity);
        Task DeleteAsync(string id);
    }
}
