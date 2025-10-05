using Microsoft.AspNetCore.Mvc;
using TrainWeb.Application.DTOS;
using TrainWeb.Application.Services;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Entities.TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripController : ControllerBase
    {
        private TripService TripService;

        public TripController(TripService tripService)
        {
            TripService = tripService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var trip = await TripService.GetById(id);
            if (trip == null) return NotFound("Trip Not Found");
            return Ok(trip.ToDto());
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trips = await TripService.GetAllAsync();
            return Ok(trips.Select(trip => trip.ToDto()));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TripDto tripDto)
        {
            var createdTrip = await TripService.AddAsync(tripDto.FromDto());
            if (createdTrip == null)
            {
                return Problem("Failed to create trip.");
            }
            return Ok(createdTrip.ToDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromRoute] string id, [FromBody] TripDto tripDto)
        {
            var trip = await TripService.GetById(id);

            if(trip == null)
            {
                return NotFound("Trip Not Found");
            }

            tripDto.Id = trip.Id;

            var updatedTrip = await TripService.UpdateAsync(id, tripDto.FromDto());

            return Ok(updatedTrip?.ToDto());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            await TripService.DeleteAsync(id);
            return Ok();
        }
    }
}
