namespace MedSlot.Api.Doctors.Dtos
{
    public class SetDoctorAvailabilityRequest
    {
        public List<DayAvailability> Days { get; set; } = new();
    }

}
