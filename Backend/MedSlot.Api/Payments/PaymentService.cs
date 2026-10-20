using System.Security.Cryptography;
using System.Text;
using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Common;
using MedSlot.Api.Common.Dtos;
using MedSlot.Api.Models;
using MedSlot.Api.Payments.Dtos;
using Razorpay.Api;
using Newtonsoft.Json.Linq;

namespace MedSlot.Api.Payments
{
    public class PaymentService: IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IConfiguration _configuration;
        private readonly ICurrentUser _currentUser;
        public PaymentService(IPaymentRepository paymentRepository, IConfiguration configuration, ICurrentUser currentUser)
        {
            _paymentRepository = paymentRepository;
            _configuration = configuration;
            _currentUser = currentUser;
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

            // Initialize Razorpay Client
            var keyId = _configuration["Razorpay:KeyId"];
            var razorpayClient = new RazorpayClient(keyId, keySecret);

            // Fetch Reference Number
            var payment = razorpayClient.Payment.Fetch(request.RazorpayPaymentId);
            var acquirerData = payment["acquirer_data"] as JObject;
            var referenceNumber = (string?)(acquirerData?["rrn"]
                ?? acquirerData?["bank_transaction_id"]
                ?? acquirerData?["auth_code"]);

            // Save Payment Attempt And Mark captured
            await _paymentRepository.MarkPaymentCaptured(request.RazorpayOrderId, request.RazorpayPaymentId, referenceNumber);
        }

        public async Task<ResumeBookingPaymentResponse> ResumeBookingPaymentAsync(Guid appointmentId)
        {
            var patientId = _currentUser.PatientId ?? throw new UnauthorizedAccessException();

            string razorpayKeyId = _configuration["Razorpay:KeyId"];
            var response = await _paymentRepository.GetRazorPayOptionsByAppointmentAsync(appointmentId, razorpayKeyId);
            return response;
        }

        public async Task<PagedResponse<TransactionSummaryResponse>> GetPatientTransactionsListingAsync(GetTransactionsListingRequest request)
        {
            var patientId = _currentUser.PatientId ?? throw new UnauthorizedAccessException();

            var (Items, Count) = await _paymentRepository.GetPatientPaymentsAsync(patientId, request);

            // Map payments to transaction dto - TransactionSummaryResponse for Listing scope
            var mappedTransactions = await _paymentRepository.MapTransactionsToDtoAsync(Items);

            var response = new PagedResponse<TransactionSummaryResponse>
            {
                Items = mappedTransactions,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalCount = Count,
            };

            return response;
        }

        public async Task<List<PaymentStatusOptionResponse>> GetPaymentStatusOptionsAsync()
        {
            return await _paymentRepository.GetAllPaymentStatusesAsync();
        }
    }
}
