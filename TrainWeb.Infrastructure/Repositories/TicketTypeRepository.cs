using Google.Cloud.Firestore;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Persistence;

namespace TrainWeb.Infrastructure.Repositories
{
    public class TicketTypeRepository : FirestoreRepository<TicketTypeEntity>, ITicketTypeRepository
    {
        private const string CollectionName = "ticketTypes";

        public TicketTypeRepository(FirestoreDbContext context) : base(context) { }

        public Task<TicketTypeEntity?> GetByIdAsync(string id)
            => GetByIdAsync(CollectionName, id);

        public Task<IEnumerable<TicketTypeEntity>> GetAllAsync()
            => GetAllAsync(CollectionName);

        public async Task<IEnumerable<TicketTypeEntity>> GetActiveAsync()
        {
            var snapshot = await FirestoreDb.Collection(CollectionName)
                .WhereEqualTo("status", "active")
                .GetSnapshotAsync();

            return snapshot.Documents.Select(d =>
            {
                var e = d.ConvertTo<TicketTypeEntity>();
                e.Id = d.Id;
                return e;
            }).ToList();
        }
        public async Task AddAsync(TicketTypeEntity ticketTypeEntity)
        {
            var docRef = FirestoreDb.Collection(CollectionName).Document(); // auto id
            ticketTypeEntity.Id = docRef.Id;
            await docRef.SetAsync(ticketTypeEntity);
        }

        public Task UpdateAsync(string id, TicketTypeEntity ticketTypeEntity)
            => UpdateAsync(CollectionName, id, ticketTypeEntity);

        public Task DeleteAsync(string id)
            => DeleteAsync(CollectionName, id);
    }
}
