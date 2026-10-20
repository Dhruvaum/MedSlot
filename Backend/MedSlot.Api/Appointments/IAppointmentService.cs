using MedSlot.Api.Appointments.Dtos;

namespace MedSlot.Api.Appointments
{
    public interface IAppointmentService
    {
        Task<BookAppointmentResponse> BookAppointmentAsync(BookAppointmentRequest request);
        Task<AppointmentSummaryResponse> GetMyAppointmentsAsync();
        Task ReleaseUnpaidAppointmentsAsync();
    }
}
