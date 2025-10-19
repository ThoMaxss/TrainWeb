using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace TrainWeb.Infrastructure.Services
{
    public class MapService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public MapService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["Map:ApiKey"]!;
        }

        // Tìm tọa độ từ tên địa điểm 
        public async Task<(double lat, double lng)?> GetCoordinatesAsync(string placeName)
        {
            var encoded = Uri.EscapeDataString(placeName);
            var url = $"https://maps.vietmap.vn/api/maps/geocode?apikey={_apiKey}&text={encoded}";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var features = doc.RootElement.GetProperty("features");
            if (features.GetArrayLength() == 0)
                return null;

            var coordinates = features[0].GetProperty("geometry").GetProperty("coordinates");
            double lng = coordinates[0].GetDouble();
            double lat = coordinates[1].GetDouble();

            return (lat, lng);
        }

        // Tính đường đi giữa 2 tọa độ
        public async Task<object?> GetDirectionsAsync(double startLat, double startLng, double endLat, double endLng)
        {
            var url = $"https://maps.vietmap.vn/api/maps/directions?apikey={_apiKey}&point={startLat},{startLng}&point={endLat},{endLng}&vehicle=car";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<object>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return data;
        }
    }
}
