using MedSlot.Api.Common;
using MedSlot.Api.Data;
using MedSlot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedSlot.Api.Patients
{
    public class PatientRepository : IPatientRepository
    {
        private readonly MedSlotDbContext _context;

        public PatientRepository(MedSlotDbContext context)
        {
            _context = context;
        }

        public async Task AddPatientAsync(Patient patient)
        {
            await _context.Patients.AddAsync(patient);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task MarkUserRegistrationCompleteAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user is null)
            {
                throw new UnauthorizedAccessException("User not found.");
            }

            user.IsRegistrationCompleted = true;
        }

        public async Task<Patient?> GetPatientById(Guid patientId)
        {
            return await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == patientId);
        }

    }
}
