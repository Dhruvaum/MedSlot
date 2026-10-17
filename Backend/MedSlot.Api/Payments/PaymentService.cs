using System.Security.Cryptography;
using System.Text;
using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Models;
using MedSlot.Api.Payments.Dtos;
using Razorpay.Api;

namespace MedSlot.Api.Payments
{
    public class PaymentService: IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IConfiguration _configuration;
        public PaymentService(IPaymentRepository paymentRepository, IConfiguration configuration)
        {
            _paymentRepository = paymentRepository;
            _configuration = configuration;
        }

        public async Task<InitiatePaymentResponse> InitiatePaymentAsync(BookAppointmentResponse appointment)
        {
            var appointmentId = appointment.AppointmentId;

            var doctor = await _paymentRepository.GetDoctorByAppoinmentIdAsync(appointmentId);

            if(doctor.ConsultDurationMinutes == null || doctor.ConsultDurationMinutes <= 0)
            {
                throw new InvalidOperationException("Consultation Duration should be more than 0 minutes");
            }
            if (doctor.ConsultationFee == null || doctor.ConsultationFee <= 0) throw new InvalidOperationException("Cannot proceed for checkout. Consultation Fee is not known for this doctor");

            // Create An Order
            var razorpayKeyId = _configuration["Razorpay:KeyId"];
            var razorpayKeySecret = _configuration["Razorpay:KeySecret"];
            var razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            var orderOptions = new Dictionary<string, object>
            {
                { "amount", (int)(doctor.ConsultationFee.Value*100) },
                { "currency", "INR" },
                { "receipt", appointmentId.ToString() },
                { "payment_capture", 1 }
            };

            Order order = razorpayClient.Order.Create(orderOptions);
            var razorpayOrderId = order["id"].ToString();

            // Create Payment Row

            await _paymentRepository.CreatePaymentRowAsync(appointment, doctor, razorpayOrderId);

            return new InitiatePaymentResponse
            {
                RazorpayOrderId = razorpayOrderId,
                Amount = doctor.ConsultationFee.Value,
                RazorpayKeyId = razorpayKeyId,
            };
        }

        public async Task VerifyPaymentAsync(VerifyPaymentRequest request)
        {
            var keySecret = _configuration["Razorpay:KeySecret"];

            var payload = $"{request.RazorpayOrderId}|{request.RazorpayPaymentId}";

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(keySecret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
            var generatedSignature = Convert.ToHexString(hash).ToLower();

            if (generatedSignature != request.RazorpaySignature) throw new InvalidOperationException("Payment verification failed - signature mismatch.");

            await _paymentRepository.MarkPaymentCaptured(request.RazorpayOrderId, request.RazorpayPaymentId);
        }
    }
}
