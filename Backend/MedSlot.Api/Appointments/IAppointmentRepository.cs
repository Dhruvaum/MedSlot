using MedSlot.Api.Appointments.Dtos;

namespace MedSlot.Api.Appointments
{
    public interface IAppointmentRepository
    {
        Task<BookAppointmentResponse> BookAppointmentAsync(BookAppointmentRequest request);
    }
}
