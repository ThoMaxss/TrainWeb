using System.Collections.Immutable;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities.TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Services
{
    public class TripService
    {
        ITripRepository TripRepository { get; }
        TrainService TrainService { get; }
        public TripService(ITripRepository tripRepository, TrainService trainService)
        {
            TripRepository = tripRepository;
            TrainService = trainService;
        }
        public async Task<Trip?> GetById(string id)
        {
            var tripEntity = await TripRepository.GetByIdAsync(id);

            if (tripEntity == null)
            {
                return null;
            }    

            var train = tripEntity.TrainId != null
                ? await TrainService.GetById(tripEntity.TrainId)
                : null;
            return tripEntity?.ToDomain(train);
        }

        public async Task<ImmutableList<Trip>> GetAllAsync()
        {
            var tripEntities = await TripRepository.GetAllAsync();

            return tripEntities.Select(tripEntity =>
            {
                var train = tripEntity.TrainId != null
                    ? TrainService.GetById(tripEntity.TrainId).Result
                    : null;
                return tripEntity.ToDomain(train);
            }).ToImmutableList();
        }

        public async Task<Trip?> AddAsync(Trip trip)
        {
            var tripEntity = TripEntity.FromDomain(trip);
            await TripRepository.AddAsync(tripEntity);
            var train = tripEntity.TrainId != null
                ? await TrainService.GetById(tripEntity.TrainId)
                : null;
            return tripEntity?.ToDomain(train);
        }

        public async Task<Trip?> UpdateAsync(string id, Trip trip)
        {
            var tripEntity = TripEntity.FromDomain(trip);
            await TripRepository.UpdateAsync(id, tripEntity);
            var train = tripEntity.TrainId != null
                ? await TrainService.GetById(tripEntity.TrainId)
                : null;
            return tripEntity?.ToDomain(train);
        }

        public async Task DeleteAsync(string id)
        {
            await TripRepository.DeleteAsync(id);
        }
    }
}
