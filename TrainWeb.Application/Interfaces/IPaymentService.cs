using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<Payment?> GetByIdAsync(string id);
        Task<IEnumerable<Payment>> GetByBookingIdAsync(string bookingId);
        Task AddAsync(Payment payment);
        Task UpdateAsync(Payment payment);
    }
}
