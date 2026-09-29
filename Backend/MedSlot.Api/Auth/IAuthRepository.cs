using MedSlot.Api.Auth.Dtos;
using MedSlot.Api.Models;

namespace MedSlot.Api.Auth
{
    public interface IAuthRepository
    {
        Task<bool> IsUserNameOrEmailTakenAsync(string userName, string email);
        Task<Guid> GetUserTypeIdByNameAsync(string typeName);
        Task AddUserAsync(User user);
        Task SaveChangesAsync();

        //Login

        Task<LoggingUser> GetLoggingUser(LoginRequest user);
    }
}
