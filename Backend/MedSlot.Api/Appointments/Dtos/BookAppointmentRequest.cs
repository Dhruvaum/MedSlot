namespace MedSlot.Api.Appointments.Dtos
{
    public class BookAppointmentRequest
    {
        public Guid TimeSlotId { get; set; }
        public string? PatientConcern { get; set; }
    }
}
