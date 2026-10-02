using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace MedSlot.Api.Common
{
    public class CurrentUser : ICurrentUser
    {
        private readonly ClaimsPrincipal? _user;
        public CurrentUser(IHttpContextAccessor httpContextAccessor)
        {
            _user = httpContextAccessor.HttpContext?.User;
        }

        public bool IsAuthenticated => _user?.Identity?.IsAuthenticated ?? false;

        public Guid? UserId =>
            Guid.TryParse(_user?.FindFirstValue(JwtRegisteredClaimNames.Sub), out var id) ? id : null;


        public string? Role => _user?.FindFirstValue("role");

        public Guid? PatientId => Guid.TryParse(_user?.FindFirstValue("patientId"), out var patientId) ? patientId : null;
    }
}
