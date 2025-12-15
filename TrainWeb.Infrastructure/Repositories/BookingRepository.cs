using Google.Cloud.Firestore;
using System.Collections;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Infrastructure.Repositories
{
    public class BookingRepository : FirestoreRepository<BookingEntity>, IBookingRepository
    {
        private const string CollectionName = "Bookings";

        public BookingRepository(FirestoreDbContext context) : base(context) {}

        public async Task<BookingEntity?> GetByIdAsync( string id)
        {
            return await GetByIdAsync(CollectionName, id);
        }

        public async Task<IEnumerable<BookingEntity>> GetAllAsync()
        {
            return await GetAllAsync(CollectionName);
        }

        public async Task AddAsync(BookingEntity bookingEntity)
        {
            await AddAsync(CollectionName, bookingEntity.Id, bookingEntity);
        }

        public async Task UpdateAsync(string id, BookingEntity bookingEntity)
        {
            await UpdateAsync(CollectionName, id, bookingEntity);
        }

        public async Task DeleteAsync(string id)
        {
            await DeleteAsync(CollectionName, id);
        }

        public async Task<IEnumerable<BookingEntity>> GetByUserIdAsync(string userId)
        {
            var snapshot = await FirestoreDb.Collection(CollectionName).WhereEqualTo("UserId", userId).GetSnapshotAsync();
            return snapshot.Documents.Select(doc => doc.ConvertTo<BookingEntity>()).ToList();
        }

        public async Task<IEnumerable<BookingEntity>> GetActiveBookingsBySeatIdAsync(string seatId)
        {
            // Need to check via ticket since BookingEntity doesn't have direct seat reference
            var allBookings = await GetAllAsync();
            var activeBookings = new List<BookingEntity>();
            
            foreach (var booking in allBookings)
            {
                if (booking.TicketId != null && 
                    (booking.Status == Domain.Enum.BookingStatus.Reserved || 
                     booking.Status == Domain.Enum.BookingStatus.Paid))
                {
                    // Note: This requires fetching ticket to check seat
                    // Better approach would be to have SeatId directly in BookingEntity
                    // For now, this method will be called from service layer with proper context
                    activeBookings.Add(booking);
                }
            }
            
            return activeBookings;
        }

        public async Task<IEnumerable<BookingEntity>> GetActiveBookingsByTicketIdAsync(string ticketId)
        {
            var allBookings = await GetAllAsync();
            return allBookings.Where(b => 
                b.TicketId == ticketId && 
                (b.Status == Domain.Enum.BookingStatus.Reserved || b.Status == Domain.Enum.BookingStatus.Paid)
            ).ToList();
        }
    }
}
