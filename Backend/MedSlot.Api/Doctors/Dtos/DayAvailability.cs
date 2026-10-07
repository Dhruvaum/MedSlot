namespace MedSlot.Api.Doctors.Dtos
{
    public class DayAvailability
    {
        public DayOfWeek DayOfWeek { get; set; }
        public bool IsOff { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
        public TimeOnly? BreakStartTime { get; set; }
        public TimeOnly? BreakEndTime { get; set; }
    }

}
