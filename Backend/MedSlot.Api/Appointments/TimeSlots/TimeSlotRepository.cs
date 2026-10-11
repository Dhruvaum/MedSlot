using MedSlot.Api.Appointments.TimeSlots.Dtos;
using MedSlot.Api.Data;
using MedSlot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedSlot.Api.Appointments.TimeSlots
{
    public class TimeSlotRepository: ITimeSlotRepository
    {
        private readonly MedSlotDbContext _context;

        public TimeSlotRepository(MedSlotDbContext context)
        {
            _context = context;
        }

        public async Task<DateTime?> GetLastSlotDate(Guid doctorId)
        {
            return await _context.TimeSlots
                .Where(t => t.DoctorId == doctorId)
                .OrderByDescending(t => t.StartTime)
                .Select(t => (DateTime?)t.StartTime.Date)
                .FirstOrDefaultAsync();
        }

        public async Task AddTimeSlotsAsync(List<TimeSlot> slots)
        {
            await _context.TimeSlots.AddRangeAsync(slots);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TimeSlot>> GetBookableSlotsByDoctorId(Guid doctorId)
        {
            var today = DateTime.UtcNow;
            
            var timeSlots = await _context.TimeSlots
                .Where(t => t.DoctorId == doctorId && t.IsBooked == false && t.StartTime >= today)
                .OrderBy(t => t.StartTime)
                .ToListAsync();

            return timeSlots;
        }
        
    }
}
