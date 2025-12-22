using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Interfaces
{
    public interface ITicketRepository
    {
        Task<TicketEntity?> GetByIdAsync(string id);
        Task<IEnumerable<TicketEntity>> GetAllAsync();

        Task<IEnumerable<TicketEntity>> GetByBookingIdAsync(string bookingId);
        Task<TicketEntity?> GetFirstByBookingIdAsync(string bookingId);
        Task<TicketEntity?> GetByTicketNumberAsync(string ticketNumber);

        Task AddAsync(TicketEntity ticketEntity);
        Task UpdateAsync(string id, TicketEntity ticketEntity);
        Task DeleteAsync(string id);
    }
}
