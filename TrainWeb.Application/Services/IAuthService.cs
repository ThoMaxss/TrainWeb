using System.Threading.Tasks;
using TrainWeb.Application.DTOs;

namespace TrainWeb.Application.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> Login(AuthRequest request);
        Task<AuthResponse> Register(RegisterRequest request);
        Task<bool> ValidateToken(string token);
        string GenerateToken(UserDto user);
    }
}
