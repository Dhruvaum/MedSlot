using MedSlot.Api.Data;
using MedSlot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedSlot.Api.Auth
{
    public class AuthRepository : IAuthRepository
    {
        private readonly MedSlotDbContext _context;

        public AuthRepository(MedSlotDbContext context)
        {
            _context = context;
        }

        public async Task<bool> IsUserNameOrEmailTakenAsync(string userName, string email)
        {
            return await _context.Users.AnyAsync(u => u.UserName == userName || u.Email == email);
        }

        public async Task<Guid> GetUserTypeIdByNameAsync(string typeName)
        {
            var userType = await _context.UserTypes.FirstOrDefaultAsync(ut => ut.TypeName == typeName);
            if (userType is null)
            {
                throw new InvalidOperationException($"UserType {typeName} does not exist ");
            }
            return userType.Id;
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

    }
}
