using MedSlot.Api.Appointments.TimeSlots.Dtos;

namespace MedSlot.Api.Appointments.TimeSlots
{
    public interface ITimeSlotService
    {
        Task GenerateSlotsAsync();
        Task<AvailableSlotResponse> GetAvailableSlotsAsync(GetAvailableSlotsRequest request);
    }
}
