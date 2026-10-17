using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Payments.Dtos;

namespace MedSlot.Api.Payments
{
    public interface IPaymentService
    {
        Task<InitiatePaymentResponse> InitiatePaymentAsync(BookAppointmentResponse appointment);
        Task VerifyPaymentAsync(VerifyPaymentRequest request);
    }
}
