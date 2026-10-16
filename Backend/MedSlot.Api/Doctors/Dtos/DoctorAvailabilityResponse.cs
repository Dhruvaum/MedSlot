namespace MedSlot.Api.Doctors.Dtos
{
    public class DoctorAvailabilityResponse
    {
        public List<DayAvailability>? Days { get; set; } = new();
        public int? ConsultDurationMinutes { get; set; }
        public decimal? ConsultationFee { get; set; }

    }
}
