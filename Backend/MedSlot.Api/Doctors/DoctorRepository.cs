using MedSlot.Api.Data;
using MedSlot.Api.Doctors.Dtos;
using MedSlot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedSlot.Api.Doctors
{
    public class DoctorRepository: IDoctorRepository
    {
        private readonly MedSlotDbContext _context;

        public DoctorRepository(MedSlotDbContext context)
        {
            _context = context;
        }

        public async Task<(List<Doctor> Items, int TotalCount)> GetDoctorsListingAsync(GetDoctorsListingRequest request)
        {
            //Get Queriable Doctor Data

            var query = _context.Doctors
                .Include(d => d.Specialization)
                .Include(d => d.Qualification)
                .Where(d => d.VerificationStatus == 1)
                .AsQueryable();

            //Filter Data

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(d => d.FullName.Contains(request.Search));
            }
            if(request.SpecializationId is not null)
            {
                query = query.Where(d => d.SpecializationId == request.SpecializationId);
            }
            if(request.QualificationId is not null)
            {
                query = query.Where(d => d.QualificationId == request.QualificationId);
            }

            // Get Total count

            var totalCount = await query.CountAsync();

            var items = await query.Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize).ToListAsync();

            // Prepare Response

            return (items, totalCount);
        }

        public async Task<Doctor> GetDoctorByIdAsync(Guid doctorId)
        {
            var query = _context.Doctors
                .Include(d => d.Specialization)
                .Include(d => d.Qualification)
                .Where(d => d.Id == doctorId);

            var doctor = await query.FirstOrDefaultAsync();

            return doctor;
        }

        public async Task SetAvailabilityAsync(Guid doctorId, List<DoctorAvailability> newRows)
        {
            var existingRows = await _context.DoctorAvailabilities
                .Where(a => a.DoctorId == doctorId)
                .ToListAsync();

            _context.DoctorAvailabilities.RemoveRange(existingRows);
            await _context.AddRangeAsync(newRows);

            await _context.SaveChangesAsync();
        }

        public async Task<List<DoctorAvailability>> GetAvailabilityByDoctorIdAsync(Guid doctorId)
        {
            var availabilities = await _context.DoctorAvailabilities.Where(a => a.DoctorId == doctorId).ToListAsync();
            return availabilities;
        }
    }
}
