using Google.Cloud.Firestore;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public class TicketRepository : FirestoreRepository<TicketEntity>, ITicketRepository
    {
        private const string CollectionName = "tickets";

        public TicketRepository(FirestoreDbContext context) : base(context) { }

        public Task<TicketEntity?> GetByIdAsync(string id)
            => GetByIdAsync(CollectionName, id);

        public Task<IEnumerable<TicketEntity>> GetAllAsync()
            => GetAllAsync(CollectionName);

        public async Task<IEnumerable<TicketEntity>> GetByBookingIdAsync(string bookingId)
        {
            var snapshot = await FirestoreDb.Collection(CollectionName)
                .WhereEqualTo("bookingId", bookingId)
                .GetSnapshotAsync();

            return snapshot.Documents.Select(d =>
            {
                var e = d.ConvertTo<TicketEntity>();
                e.Id = d.Id;
                return e;
            }).ToList();
        }
        public async Task<TicketEntity?> GetFirstByBookingIdAsync(string bookingId)
        {
            var snapshot = await FirestoreDb.Collection(CollectionName)
                .WhereEqualTo("bookingId", bookingId)
                .Limit(1)
                .GetSnapshotAsync();

            var doc = snapshot.Documents.FirstOrDefault();
            if (doc == null) return null;

            var e = doc.ConvertTo<TicketEntity>();
            e.Id = doc.Id;
            return e;
        }

        public async Task<TicketEntity?> GetByTicketNumberAsync(string ticketNumber)
        {
            var snapshot = await FirestoreDb.Collection(CollectionName)
                .WhereEqualTo("ticketNumber", ticketNumber)
                .Limit(1)
                .GetSnapshotAsync();

            var doc = snapshot.Documents.FirstOrDefault();
            if (doc == null) return null;

            var e = doc.ConvertTo<TicketEntity>();
            e.Id = doc.Id; 
            return e;
        }

        public Task AddAsync(TicketEntity ticketEntity)
            => AddAsync(CollectionName, ticketEntity.Id, ticketEntity);

        public Task UpdateAsync(string id, TicketEntity ticketEntity)
            => UpdateAsync(CollectionName, id, ticketEntity);

        public Task DeleteAsync(string id)
            => DeleteAsync(CollectionName, id);
    }
}
