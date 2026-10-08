using MedSlot.Api.Models;

namespace MedSlot.Api.Appointments.TimeSlots
{
    public interface ITimeSlotRepository
    {
        Task<DateTime?> GetLastSlotDate(Guid doctorId);
        Task AddTimeSlotsAsync(List<TimeSlot> slots);
    }
}
