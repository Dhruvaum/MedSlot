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
        Task<(List<PaymentAttempt> Items, int Count)> GetPatientPaymentsAsync(Guid patientId, GetTransactionsListingRequest request);
        Task<List<TransactionSummaryResponse>> MapTransactionsToDtoAsync(List<PaymentAttempt> payments);
        Task<List<PaymentStatusOptionResponse>> GetAllPaymentStatusesAsync();
        Task<ResumeBookingPaymentResponse> GetRazorPayOptionsByAppointmentAsync(Guid appointmentId, string keyId);
    }
}
