using MedSlot.Api.Auth.Dtos;

namespace MedSlot.Api.Auth
{
    public interface IAuthService
    {
        Task<RegisterResponse> RegisterAsync(RegisterRequest request);
    }
}
