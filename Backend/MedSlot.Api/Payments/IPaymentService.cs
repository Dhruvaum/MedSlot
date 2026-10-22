using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Common.Dtos;
using MedSlot.Api.Payments.Dtos;

namespace MedSlot.Api.Payments
{
    public interface IPaymentService
    {
        Task<InitiatePaymentResponse> InitiatePaymentAsync(BookAppointmentResponse appointment);
        Task VerifyPaymentAsync(VerifyPaymentRequest request);
        Task<ResumeBookingPaymentResponse> ResumeBookingPaymentAsync(Guid appointmentId);
        Task<CancelAppointmentResponse> RefundPaymentAsync(Guid appointmentId);
        Task<PagedResponse<TransactionSummaryResponse>> GetPatientTransactionsListingAsync(GetTransactionsListingRequest request);
        Task<List<PaymentStatusOptionResponse>> GetPaymentStatusOptionsAsync();
    }
}
