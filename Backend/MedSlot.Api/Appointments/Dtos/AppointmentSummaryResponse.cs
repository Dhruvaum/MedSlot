namespace MedSlot.Api.Appointments.Dtos
{
    public class AppointmentSummaryResponse
    {
        public List<AppointmentSummary> Appointments { get; set; }
    }

    public class AppointmentSummary
    {
        public Guid Id { get; set; }
        public string DoctorName { get; set; }
        public string? SpecializationName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; }
        public DateTime BookedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Concern { get; set; }
        public DateTime? HoldExpiresAt { get; set; }
    }
}
