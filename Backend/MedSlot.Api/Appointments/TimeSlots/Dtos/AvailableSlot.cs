using MedSlot.Api.Models;

namespace MedSlot.Api.Appointments.TimeSlots.Dtos
{
    public class AvailableSlot
    {
        public Guid Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
