using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Application.Interfaces
{
    public interface IPaymentRepository : IRepository<PaymentEntity>
    {
        Task<PaymentEntity?> GetByIdAsync(string id);
        Task<IEnumerable<PaymentEntity>> GetAllAsync();
        Task<IEnumerable<PaymentEntity>?> GetByBookingIdAsync(string bookingId);
        Task<PaymentEntity?> GetPendingByBookingIdAsync(string bookingId);
        Task<IEnumerable<PaymentEntity>?> GetByUserIdAsync(string userId);
        Task AddAsync(PaymentEntity paymentEntity);
        Task UpdateAsync(string id, PaymentEntity paymentEntity);
        Task DeleteAsync(string id);
    }
}
