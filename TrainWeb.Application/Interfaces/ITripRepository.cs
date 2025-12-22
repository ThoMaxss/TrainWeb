using System.Collections.Generic;
using System.Threading.Tasks;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Application.Interfaces
{
    public interface ITripRepository : IRepository<TripEntity>
    {
        Task<TripEntity?> GetByIdAsync(string id);
        Task<IEnumerable<TripEntity>> GetAllAsync();

        Task AddAsync(TripEntity tripEntity);
        Task UpdateAsync(string id, TripEntity tripEntity);
        Task DeleteAsync(string id);
    }
}
