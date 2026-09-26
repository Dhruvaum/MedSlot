
namespace MedSlot.Api.Auth
{
    public interface ITokenService
    {
        string GenerateToken(Guid userId, string role);
    }
}
