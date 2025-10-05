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
    public class TripService
    {
        ITrainRepository TrainRepository { get; }
        ITripRepository TripRepository { get; }
        public TripService(
            ITrainRepository trainRepository,
            ITripRepository tripRepository)
        {
            TrainRepository = trainRepository;
            TripRepository = tripRepository;
        }
        public async Task<Trip?> GetById(string id)
        {
            var tripEntity = await TripRepository.GetByIdAsync(id);

            if (tripEntity == null)
            {
                return null;
            }    

            var trainEntity = tripEntity.TrainId != null 
                ? await TrainRepository.GetByIdAsync(tripEntity.TrainId)
                : null;

            // Fix CS8602: Only call ToDomain if tripEntity is not null (already checked above)
            // and ensure trainEntity can be null (as per ToDomain signature)
            return tripEntity?.ToDomain(trainEntity);
        }

        public async Task<ImmutableList<Trip>> GetAllAsync()
        {
            var tripEntities = await TripRepository.GetAllAsync();

            var tasks = tripEntities.Select(tripEntity => GetById(tripEntity.Id));

            var results = await Task.WhenAll(tasks);

            // Filter out nulls to match ImmutableList<Trip>
            return results.Where(trip => trip != null)
                          .Select(trip => trip!)
                          .ToImmutableList();
        }

        public async Task<Trip?> AddAsync(Trip trip)
        {
            var tripEntity = TripEntity.FromDomain(trip);
            await TripRepository.AddAsync(tripEntity);
            var trainEntity = await TrainRepository.GetByIdAsync(tripEntity.TrainId);
            // Fix CS8602: tripEntity is not null here, but for safety use null-conditional
            return tripEntity?.ToDomain(trainEntity);
        }

        public async Task<Trip?> UpdateAsync(string id, Trip trip)
        {
            var tripEntity = TripEntity.FromDomain(trip);
            await TripRepository.UpdateAsync(id, tripEntity);
            var trainEntity = tripEntity != null 
                ? await TrainRepository.GetByIdAsync(tripEntity.TrainId)
                : null;
            // Fix CS8602: tripEntity is not null here, but for safety use null-conditional
            return tripEntity?.ToDomain(trainEntity);
        }

        public async Task DeleteAsync(string id)
        {
            await TripRepository.DeleteAsync(id);
        }
    }
}
