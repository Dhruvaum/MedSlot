using MedSlot.Api.Appointments.TimeSlots;

namespace MedSlot.Api.BackgroundJobs
{
    public class TimeSlotGenerationJob
    {
        private readonly ITimeSlotService _timeSlotService;

        public TimeSlotGenerationJob(ITimeSlotService timeSlotService)
        {
            _timeSlotService = timeSlotService;
        }

        public async Task RunAsync()
        {
            await _timeSlotService.GenerateSlotsAsync();
        }
    }
}
