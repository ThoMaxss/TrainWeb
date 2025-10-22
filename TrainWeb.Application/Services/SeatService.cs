using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Entities.TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Services
{
    public class SeatService
    {
        ISeatRepository SeatRepository { get; }
        TripService TripService { get; }

        public SeatService(
            ISeatRepository seatRepository,
            TripService tripService) 
        {
            SeatRepository = seatRepository;
            TripService = tripService;
        }
        public async Task<Seat?> GetById(string id)
        {
            var seatEntity = await SeatRepository.GetByIdAsync(id);

            if (seatEntity == null)
            {
                return null;
            }

            var trip = seatEntity.TripId != null
                ? await TripService.GetById(seatEntity.TripId)
                : null;

            return seatEntity.ToDomain(trip);
        }

        public async Task<ImmutableList<Seat>> GetAllAsync()
        {
            var seatEntities = await SeatRepository.GetAllAsync();

            return seatEntities.Select(seatEntity => {
                var trip = seatEntity.TripId != null
                    ? TripService.GetById(seatEntity.TripId).Result
                    : null;
                return seatEntity.ToDomain(trip);
            }).ToImmutableList();
        }

        public async Task<Seat?> AddAsync(Seat seat)
        {
            var seatEntity = SeatEntity.FromDomain(seat);
            await SeatRepository.AddAsync(seatEntity);
            var trip = seatEntity.TripId != null
                ? await TripService.GetById(seatEntity.TripId)
                : null;
            return seatEntity.ToDomain(trip);
        }

        public async Task<Seat?> UpdateAsync(string id, Seat seat)
        {
            var seatEntity = SeatEntity.FromDomain(seat);
            await SeatRepository.UpdateAsync(id, seatEntity);
            var trip = seatEntity.TripId != null
                ? await TripService.GetById(seatEntity.TripId)
                : null;
            return seatEntity.ToDomain(trip);
        }

        public async Task DeleteAsync(string id)
        {
            await SeatRepository.DeleteAsync(id);
        }
    }
}
