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

        public async Task<ImmutableList<Seat>> GetByTripIdAsync(string tripId)
        {
            var seatEntities = await SeatRepository.GetByTripIdAsync(tripId);
            var trip = await TripService.GetById(tripId);

            return seatEntities.Select(seatEntity => seatEntity.ToDomain(trip))
                .ToImmutableList();
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

        public async Task MarkSeatAsUnavailable(string seatId)
        {
            var seatEntity = await SeatRepository.GetByIdAsync(seatId);
            if (seatEntity != null)
            {
                seatEntity.IsAvailable = false;
                await SeatRepository.UpdateAsync(seatId, seatEntity);
            }
        }

        public async Task MarkSeatAsAvailable(string seatId)
        {
            var seatEntity = await SeatRepository.GetByIdAsync(seatId);
            if (seatEntity != null)
            {
                seatEntity.IsAvailable = true;
                await SeatRepository.UpdateAsync(seatId, seatEntity);
            }
        }
    }
}
