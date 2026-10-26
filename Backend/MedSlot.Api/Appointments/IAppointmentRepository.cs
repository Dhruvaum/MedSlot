using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Models;

namespace MedSlot.Api.Appointments
{
    public interface IAppointmentRepository
    {
        Task<bool> CheckIfSlotExistsAsync(Guid timeSlotId);
        Task<bool> CheckIfSlotAlreadyBooked(Guid timeSlotId);
        Task<BookAppointmentResponse> BookAppointmentAsync(Guid patientId, BookAppointmentRequest request);
        Task<List<Appointment>> GetMyAppointmentsAsync(Guid patientId);
        Task<(string determinedCase, string? refundType)> DetermineCancellationCaseAsync(Guid patientId, Guid appointmentId);
        Task<CancelAppointmentResponse> InitiateNoRefundAppointmentCansellation(Guid patientId, Guid appointmentId, bool? confirmCancel);
        Task ReleaseUnpaidAppointmentsAsync();
    }
}
