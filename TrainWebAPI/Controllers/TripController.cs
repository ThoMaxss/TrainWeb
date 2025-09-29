using Microsoft.AspNetCore.Mvc;
using TrainWeb.Domain.Entities;
using TrainWeb.Domain.Entities.TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripController : ControllerBase
    {
        private readonly FirestoreRepository<Trip> _repo;

        public TripController(FirestoreRepository<Trip> repo)
        {
            _repo = repo;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var trip = await _repo.GetByIdAsync("Trips", id);
            if (trip == null) return NotFound();
            return Ok(trip);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trips = await _repo.GetAllAsync("Trips");
            return Ok(trips);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Trip trip)
        {
            await _repo.AddAsync("Trips", trip.Id, trip);
            return Ok(trip);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Trip trip)
        {
            await _repo.UpdateAsync("Trips", id, trip);
            return Ok(trip);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _repo.DeleteAsync("Trips", id);
            return Ok("Deleted successfully");
        }
    }
}
