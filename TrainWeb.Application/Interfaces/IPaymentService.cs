using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentEntity?> GetByIdAsync(string id);
        Task<IEnumerable<PaymentEntity>> GetByBookingIdAsync(string bookingId);
        Task AddAsync(PaymentEntity payment);
        Task UpdateAsync(PaymentEntity payment);
    }
}
