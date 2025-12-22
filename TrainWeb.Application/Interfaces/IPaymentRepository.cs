using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Interfaces
{
    public interface IPaymentRepository
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
