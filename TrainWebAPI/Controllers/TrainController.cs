using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainController : ControllerBase
    {
        private TrainService TrainService { get; }

        public TrainController(TrainService trainService)
        {
            TrainService = trainService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var train = await TrainService.GetById(id);
            if (train == null) return NotFound("Train Not Found");
            return Ok(train.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trains = await TrainService.GetAllAsync();
            return Ok(trains.Select(train => train.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TrainDto trainDto)
        {
            var createdTrain = await TrainService.AddAsync(trainDto.FromDto());
            return Ok(createdTrain?.ToDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            [FromRoute] string id, 
            [FromBody] TrainDto trainDto
        )
        {
            var train = await TrainService.GetById(id);
            if (train == null)
            {
                return NotFound("Train Not Found");
            }
            trainDto.Id = train.Id;
            var updatedTrain = await TrainService.UpdateAsync(id, trainDto.FromDto());
            return Ok(updatedTrain?.ToDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(
            [FromRoute] string id
        )
        {
            var train = await TrainService.GetById(id);
            if (train == null)
            {
                return NotFound("Train Not Found");
            }
            await TrainService.DeleteAsync(id);
            return Ok();
        }
    }
}
