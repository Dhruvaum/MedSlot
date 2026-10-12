namespace MedSlot.Api.Appointments.Dtos
{
    public class BookAppointmentResponse
    {
        public Guid AppointmentId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
