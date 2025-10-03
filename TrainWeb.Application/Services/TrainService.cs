using System;
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
    public class TrainService
    {
        ITrainRepository TrainRepository { get; }
        public TrainService(ITrainRepository trainRepository)
        {
            TrainRepository = trainRepository;
        }
        public async Task<Train?> GetById(string id)
        {
            var trainEntity = await TrainRepository.GetByIdAsync(id);

            return trainEntity?.ToDomain();
        }

        public async Task<ImmutableList<Train>> GetAllAsync()
        {
            var trainEntities = await TrainRepository.GetAllAsync();

            return trainEntities.Select(trainEntity => trainEntity.ToDomain()).ToImmutableList();
        }

        public async Task<Train?> AddAsync(Train train)
        {
            var trainEntity = TrainEntity.FromDomain(train);
            await TrainRepository.AddAsync(trainEntity);
            return trainEntity.ToDomain();
        }

        public async Task<Train?> UpdateAsync(string id, Train train)
        {
            var trainEntity = TrainEntity.FromDomain(train);
            await TrainRepository.UpdateAsync(id, trainEntity);
            return trainEntity.ToDomain();
        }

        public async Task DeleteAsync(string id)
        {
            await TrainRepository.DeleteAsync(id);
        }
    }
}
