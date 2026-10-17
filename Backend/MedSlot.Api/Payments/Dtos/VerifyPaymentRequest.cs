namespace MedSlot.Api.Payments.Dtos
{
    public class VerifyPaymentRequest
    {
        public string RazorpayPaymentId { get; set; }
        public string RazorpayOrderId { get; set; }
        public string RazorpaySignature { get; set; }
    }
}
