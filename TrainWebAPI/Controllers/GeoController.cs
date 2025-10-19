using Microsoft.AspNetCore.Mvc;

namespace TrainWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GeoController : ControllerBase
    {
        private readonly MapService _vietMapService;

        public GeoController(MapService vietMapService)
        {
            _vietMapService = vietMapService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCoordinates([FromQuery] string name)
        {
            var result = await _vietMapService.GetCoordinatesAsync(name);
            if (result == null)
                return NotFound(new { message = "Không tìm thấy địa điểm" });

            return Ok(new
            {
                Name = name,
                Latitude = result.Value.lat,
                Longitude = result.Value.lng
            });
        }
    }
}
