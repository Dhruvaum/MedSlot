using MedSlot.Api.Appointments.TimeSlots.Dtos;

namespace MedSlot.Api.Appointments.TimeSlots
{
    public interface ITimeSlotService
    {
        Task GenerateSlotsAsync();
        Task<List<AvailableSlot>> GetAvailableSlotsAsync(GetAvailableSlotsRequest request);
    }
}
