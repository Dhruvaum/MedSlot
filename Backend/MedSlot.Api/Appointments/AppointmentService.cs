using MedSlot.Api.Appointments.Dtos;

namespace MedSlot.Api.Appointments
{
    public class AppointmentService: IAppointmentService
    {
        private IAppointmentRepository _appointmentRepository;

        public AppointmentService(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task<BookAppointmentResponse> BookAppointmentAsync(BookAppointmentRequest request)
        {
            var response = await _appointmentRepository.BookAppointmentAsync(request);
            return response;
        }
    }
}
