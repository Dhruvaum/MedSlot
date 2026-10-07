namespace MedSlot.Api.Doctors.Dtos
{
    public class DoctorAvailabilityResponse
    {
        public List<DayAvailability> Days { get; set; } = new();

    }
}
