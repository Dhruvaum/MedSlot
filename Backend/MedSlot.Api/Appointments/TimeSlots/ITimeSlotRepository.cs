using MedSlot.Api.Appointments.TimeSlots.Dtos;
using MedSlot.Api.Models;

namespace MedSlot.Api.Appointments.TimeSlots
{
    public interface ITimeSlotRepository
    {
        Task<DateTime?> GetLastSlotDate(Guid doctorId);
        Task AddTimeSlotsAsync(List<TimeSlot> slots);
        Task<AvailableSlotResponse> GetAvailableSlotsByDoctorId(Guid doctorId);
    }
}
