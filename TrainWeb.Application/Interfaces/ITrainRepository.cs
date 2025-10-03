using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Application.Interfaces
{
    public interface ITrainRepository : IRepository<TrainEntity>
    {
        Task<TrainEntity?> GetByIdAsync(string id);
        Task<IEnumerable<TrainEntity>> GetAllAsync();
        Task AddAsync(TrainEntity trainEntity);
        Task UpdateAsync(string id, TrainEntity trainEntity);
        Task DeleteAsync(string id);
    }
}
