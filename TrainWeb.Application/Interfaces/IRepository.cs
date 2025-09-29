using System.Collections.Generic;
using System.Threading.Tasks;

namespace TrainWeb.Infrastructure.Repositories
{
    public interface IRepository<T>
    {
        Task<T?> GetByIdAsync(string collection, string id);
        Task<IEnumerable<T>> GetAllAsync(string collection);
        Task AddAsync(string collection, string id, T entity);
        Task UpdateAsync(string collection, string id, T entity);
        Task DeleteAsync(string collection, string id);
    }
}
