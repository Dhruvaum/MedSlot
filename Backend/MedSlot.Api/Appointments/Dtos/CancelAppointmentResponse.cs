namespace MedSlot.Api.Appointments.Dtos
{
    public class CancelAppointmentResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public Boolean? ConfirmationRequired { get; set; } = null;
        public string? Case { get; set; } = null;
        public string? RefundType { get; set; } = null;
    }
}
