using System.Security.Claims;

namespace MedSlot.Api.Auth
{
    public interface ITokenService
    {
        string GenerateToken(Guid userId, string role, params Claim[] additionalClaims);
    }
}
