using Microsoft.AspNetCore.Mvc;
using TrainWeb.Domain.Entities;
using TrainWeb.Infrastructure.Repositories;

namespace TrainWeb.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainController : ControllerBase
    {
        private readonly FirestoreRepository<Train> _repo;

        public TrainController(FirestoreRepository<Train> repo)
        {
            _repo = repo;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var train = await _repo.GetByIdAsync("Trains", id);
            if (train == null) return NotFound();
            return Ok(train);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var trains = await _repo.GetAllAsync("Trains");
            return Ok(trains);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Train train)
        {
            await _repo.AddAsync("Trains", train.Id, train);
            return Ok(train);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Train train)
        {
            await _repo.UpdateAsync("Trains", id, train);
            return Ok(train);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _repo.DeleteAsync("Trains", id);
            return Ok("Deleted successfully");
        }
    }
}
