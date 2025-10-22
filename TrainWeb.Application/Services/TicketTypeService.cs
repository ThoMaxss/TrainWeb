using Google.Cloud.Firestore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Services
{
    public class TicketTypeService
    {
        private ITicketTypeRepository TicketTypeRepository { get; }

        public TicketTypeService(ITicketTypeRepository ticketTypeRepository)
        {
            TicketTypeRepository = ticketTypeRepository;
        }

        public async Task<TicketType?> GetById(string id)
        {
            var ticketTypeEntity = await TicketTypeRepository.GetByIdAsync(id);

            if (ticketTypeEntity == null)
            {
                return null;
            }

            return ticketTypeEntity.ToDomain();
        }

        public async Task<ImmutableList<TicketType>> GetAllAsync()
        {
            var ticketTypeEntities = await TicketTypeRepository.GetAllAsync();
            return ticketTypeEntities.Select(tickeTypeEntity => tickeTypeEntity.ToDomain()).ToImmutableList();
        }

        public async Task<TicketType?> AddAsync(TicketType ticketType)
        {
            var ticketTypeEntity = TicketTypeEntity.FromDomain(ticketType);
            await TicketTypeRepository.AddAsync(ticketTypeEntity);

            return ticketTypeEntity.ToDomain();
        }

        public async Task<TicketType?> UpdateAsync(string id, TicketType ticketType)
        {
            var ticketTypeEntity = TicketTypeEntity.FromDomain(ticketType);
            await TicketTypeRepository.UpdateAsync(id, ticketTypeEntity);

            return ticketTypeEntity.ToDomain();
        }

        public async Task DeleteAsync(string id)
        {
            await TicketTypeRepository.DeleteAsync(id);
        }
    }
}
