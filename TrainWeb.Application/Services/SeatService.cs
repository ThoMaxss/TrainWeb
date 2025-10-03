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
        ITrainRepository TrainRepository { get; }
        ITripRepository TripRepository { get; }
        public SeatService(
            ISeatRepository seatRepository, 
            ITrainRepository trainRepository, 
            ITripRepository tripRepository) 
        {
            SeatRepository = seatRepository;
            TrainRepository = trainRepository;
            TripRepository = tripRepository;
        }
        public async Task<Seat> GetById(string id)
        {
            var seatEntity = await SeatRepository.GetByIdAsync(id);

            if (seatEntity == null)
            {
                return null;
            }

            var tripEntity = seatEntity.TripId != null 
                ? await TripRepository.GetByIdAsync(seatEntity.TripId)
                : null;

            var trainEntity = tripEntity?.TrainId != null 
                ? await TrainRepository.GetByIdAsync(tripEntity.TrainId)
                : null;

            return seatEntity.ToDomain(tripEntity, trainEntity);
        }

        public async Task<ImmutableList<Seat>> GetAllAsync()
        {
            var seatEntities = await SeatRepository.GetAllAsync();

            var tasks = seatEntities.Select(seatEntity => GetById(seatEntity.Id));

            var results = await Task.WhenAll(tasks);

            return results.ToImmutableList();
        }

        public async Task<Seat?> AddAsync(Seat seat)
        {
            var seatEntity = SeatEntity.FromDomain(seat);
            await SeatRepository.AddAsync(seatEntity);
            var tripEntity = await TripRepository.GetByIdAsync(seatEntity.TripId);
            var trainEntity = tripEntity.TrainId != null
                ? await TrainRepository.GetByIdAsync(tripEntity.TrainId)
                : null;
            return seatEntity.ToDomain(tripEntity, trainEntity);
        }

        public async Task<Seat?> UpdateAsync(string id, Seat seat)
        {
            var seatEntity = SeatEntity.FromDomain(seat);
            await SeatRepository.UpdateAsync(id, seatEntity);
            var tripEntity = seatEntity.TripId != null 
                ? await TripRepository.GetByIdAsync(seatEntity.TripId)
                : null;
            var trainEntity = tripEntity.TrainId != null
                ? await TrainRepository.GetByIdAsync(tripEntity.TrainId)
                : null;
            return seatEntity.ToDomain(tripEntity, trainEntity);
        }

        public async Task DeleteAsync(string id)
        {
            await SeatRepository.DeleteAsync(id);
        }
    }
}
