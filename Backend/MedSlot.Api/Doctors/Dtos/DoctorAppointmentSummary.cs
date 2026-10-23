namespace MedSlot.Api.Doctors.Dtos
{
    public class DoctorAppointmentSummary
    {
        public Guid Id { get; set; }
        public string PatientName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; }
        public string? Concern { get; set; } = null;
    }
}
