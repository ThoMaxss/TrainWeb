using System;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using TrainWeb.Application.Interfaces;
using TrainWeb.Domain.Domain;
using TrainWeb.Domain.Entities;

namespace TrainWeb.Application.Services
{
    public class TripService
    {
        private readonly ITripRepository _repo;

        public TripService(ITripRepository tripRepository)
        {
            _repo = tripRepository;
        }

        public async Task<Trip?> GetByIdAsync(string id)
        {
            var entity = await _repo.GetByIdAsync(id);
            return entity?.ToDomain();
        }

        public async Task<ImmutableList<Trip>> GetAllAsync()
        {
            var entities = await _repo.GetAllAsync();
            return entities.Select(e => e.ToDomain()).ToImmutableList();
        }

        public async Task<Trip> AddAsync(Trip trip)
        {
            var entity = TripEntity.FromDomain(trip);
            await _repo.AddAsync(entity);

            var created = await _repo.GetByIdAsync(entity.Id);
            return (created ?? entity).ToDomain();
        }

        public async Task<Trip?> UpdateAsync(string id, Trip trip)
        {
            var normalized = new Trip(
                id: id,
                trainId: trip.TrainId,
                trainName: trip.TrainName,
                trainType: trip.TrainType,
                departure: trip.Departure,
                arrival: trip.Arrival,
                originStationId: trip.OriginStationId,
                originStationName: trip.OriginStationName,
                destinationStationId: trip.DestinationStationId,
                destinationStationName: trip.DestinationStationName,
                seatsAvailable: trip.SeatsAvailable
            );

            var entity = TripEntity.FromDomain(normalized);
            await _repo.UpdateAsync(id, entity);

            var updated = await _repo.GetByIdAsync(id);
            return updated?.ToDomain();
        }

        public Task DeleteAsync(string id)
            => _repo.DeleteAsync(id);
    }
}
