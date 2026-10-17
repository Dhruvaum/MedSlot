namespace MedSlot.Api.Appointments.Dtos
{
    public class BookAppointmentResponse
    {
        public Guid AppointmentId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        // Order Related
        public string RazorpayOrderId { get; set; }
        public decimal Amount { get; set; }
        public string RazorpayKeyId { get; set; }
    }
}
