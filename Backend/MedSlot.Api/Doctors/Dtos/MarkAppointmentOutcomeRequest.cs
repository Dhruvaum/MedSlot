namespace MedSlot.Api.Doctors.Dtos
{
    public class MarkAppointmentOutcomeRequest
    {
       public Guid AppointmentId {  get; set; }
       public string Outcome { get; set; }
    }
}
