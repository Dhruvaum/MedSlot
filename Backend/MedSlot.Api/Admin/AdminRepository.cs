using MedSlot.Api.Data;
using MedSlot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedSlot.Api.Admin
{
    public class AdminRepository: IAdminRepository
    {
        private readonly MedSlotDbContext _context;

        public AdminRepository(MedSlotDbContext context)
        {
            _context = context;
        }

        public async Task<List<Doctor>> GetPendingDoctorVerificationsAsync()
        {
            var doctors = await _context.Doctors
                .Include(d => d.Qualification)
                .Include(d => d.RegisteringCouncil)
                .Where(d => d.VerificationStatus == 0)
                .ToListAsync();

            return doctors;
        }

        public async Task VerifyDoctorAsync(Guid doctorId)
        {
            var doctor = await _context.Doctors
                .Where(d => d.Id == doctorId)
                .FirstOrDefaultAsync();

            doctor.VerificationStatus = 1;

            await _context.SaveChangesAsync();
        }
    }
}
