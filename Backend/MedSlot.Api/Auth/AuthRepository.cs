using System.Security.Authentication;
using MedSlot.Api.Auth.Dtos;
using MedSlot.Api.Data;
using MedSlot.Api.Models;
using Microsoft.AspNetCore.Identity;
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

        //Login

        public async Task<LoggingUser> GetLoggingUser(LoginRequest request)
        {
            User? user = await _context.Users
                .Include(u => u.UserType)
                .FirstOrDefaultAsync(u => u.UserName == request.UserName);
            if (user == null) return new LoggingUser();

            var userType = user.UserType.TypeName;
            var isRegistrationCompleted = user.IsRegistrationCompleted;

            Guid? patientId = null;
            Guid? doctorId = null;

            if (userType == "Patient")
            {
                Patient? patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id);
                if (patient is not null) patientId = patient.Id;
            }
            else if (userType == "Doctor")
            {
                Doctor? doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
                if (doctor is not null) doctorId = doctor.Id;
            }

            var loggingUser = new LoggingUser
            {
                user = user,
                userType = userType!,
                patientId = patientId,
                doctorId = doctorId,
                isRegistrationCompleted = isRegistrationCompleted
            };

            return loggingUser;
        }
    }
}
