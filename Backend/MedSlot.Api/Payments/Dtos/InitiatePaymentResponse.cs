namespace MedSlot.Api.Payments.Dtos
{
    public class InitiatePaymentResponse
    {
        public string RazorpayOrderId { get; set; }
        public decimal Amount { get; set; }
        public string RazorpayKeyId { get; set; }
    }
}
