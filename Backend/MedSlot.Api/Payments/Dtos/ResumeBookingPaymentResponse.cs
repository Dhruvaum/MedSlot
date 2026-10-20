namespace MedSlot.Api.Payments.Dtos
{
    public class ResumeBookingPaymentResponse
    {
        public string RazorpayOrderId { get; set; }
        public decimal Amount { get; set; }
        public string RazorpayKeyId { get; set; }
    }
}
