using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Models;
using MedSlot.Api.Payments.Dtos;

namespace MedSlot.Api.Payments
{
    public interface IPaymentRepository
    {
        Task<Doctor> GetDoctorByAppoinmentIdAsync(Guid appointmentId);
        Task CreatePaymentRowAsync(BookAppointmentResponse appointmentResponse, Doctor doctor, string orderId);
        Task MarkPaymentCaptured(string orderId, string paymentId, string? referenceNumber);
        Task<(List<PaymentAttempt> Items, List<Refund> Refunds)> GetPatientTransactionsAsync(Guid patientId, GetTransactionsListingRequest request);
        Task<List<TransactionSummaryResponse>> MapTransactionsToDtoAsync(List<PaymentAttempt> payments, List<Refund> refunds);
        Task<List<PaymentStatusOptionResponse>> GetAllPaymentStatusesAsync();
        Task<ResumeBookingPaymentResponse> GetRazorPayOptionsByAppointmentAsync(Guid appointmentId, string keyId);
        Task<(string gatewayPaymentId, decimal amount, DateTime slotStartTime)> GetCapturedPaymentDetailsAsync(Guid appointmentId);
        Task CreateRefundRowAndReleaseSlotAsync(Guid appointmentId, decimal refundAmount, string reason, string gatewayRefundId, string refundReferenceNumber);
        Task<List<Refund>> GetPendingRefundsAsync();
        Task MarkRefundProcessedAsync(Guid refundId);
        Task MarkRefundFailedAsync(Guid refundId);
        Task ReleaseEligibleFundsAsync();
    }
}
