using Google.Cloud.Firestore;
using System.Collections;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.Infrastructure.Persistence
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
    }
}
