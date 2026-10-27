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

        public async Task<CancelAppointmentResponse> InitiateRefundAndCancelAppointmentAsync(Guid appointmentId, string refundType)
        {
            var (gatewayPaymentId, amount, slotStartTime) = await _paymentRepository.GetCapturedPaymentDetailsAsync(appointmentId);

            bool isFullRefund = refundType == "FullRefund";
            var refundAmount = isFullRefund ? amount : amount - 50;
            if (refundAmount < 0) refundAmount = 0;

            var razorpayKeyId = _configuration["Razorpay:KeyId"];
            var razorpayKeySecret = _configuration["Razorpay:KeySecret"];
            var razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            var refundOptions = new Dictionary<string, object>
            {
                { "amount", (int)(refundAmount * 100) }
            };

            var payment = razorpayClient.Payment.Fetch(gatewayPaymentId);
            var refund = payment.Refund(refundOptions);

            var gatewayRefundId = refund["id"].ToString() ?? throw new InvalidOperationException();
            var refundAcquirerData = refund["acquirer_data"] as Newtonsoft.Json.Linq.JObject;
            string refundReferenceNumber = refundAcquirerData?["arn"]?.ToString();

            var reason = isFullRefund
                ? "Patient cancelled - full refund (>2hr before appointment)"
                : "Patient cancelled - late cancellation penalty (<2hr before appointment)";

            await _paymentRepository.CreateRefundRowAndReleaseSlotAsync(appointmentId, refundAmount, reason, gatewayRefundId, refundReferenceNumber);

            return new CancelAppointmentResponse
            {
                StatusCode = 200,
                Message = isFullRefund
                    ? "Appointment cancelled. Full Refund initiated."
                    : "Appointment cancelled. A ₹50 late-cancellation penalty was deducted as per compliance of company policy"
            };
        }

        public async Task<PagedResponse<TransactionSummaryResponse>> GetPatientTransactionsListingAsync(GetTransactionsListingRequest request)
        {
            var patientId = _currentUser.PatientId ?? throw new UnauthorizedAccessException();

            var (attempts, refunds) = await _paymentRepository.GetPatientTransactionsAsync(patientId, request);
            var merged = await _paymentRepository.MapTransactionsToDtoAsync(attempts, refunds);

            var count = merged.Count;
            var items = merged.Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize).ToList();

            var response = new PagedResponse<TransactionSummaryResponse>
            {
                Items = items,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalCount = count,
            };

            return response;
        }

        public async Task<List<PaymentStatusOptionResponse>> GetPaymentStatusOptionsAsync()
        {
            return await _paymentRepository.GetAllPaymentStatusesAsync();
        }

        public async Task SettleRefundsJobAsync()
        {
            var pendingRefunds = await _paymentRepository.GetPendingRefundsAsync();

            var razorpayKeyId = _configuration["Razorpay:KeyId"];
            var razorpaySecret = _configuration["Razorpay:KeySecret"];
            var razorpayClient = new RazorpayClient(razorpayKeyId, razorpaySecret);

            foreach(var refund in pendingRefunds)
            {
                var gatewayRefund = razorpayClient.Refund.Fetch(refund.GatewayRefundId);
                var status = gatewayRefund["status"].ToString();

                if (status == "processed") await _paymentRepository.MarkRefundProcessedAsync(refund.Id);
                else if(status == "failed") await _paymentRepository.MarkRefundFailedAsync(refund.Id);
            }
        }

        public async Task ReleaseEligibleFundsAsync()
        {
            await _paymentRepository.ReleaseEligibleFundsAsync();
        }
    }
}
