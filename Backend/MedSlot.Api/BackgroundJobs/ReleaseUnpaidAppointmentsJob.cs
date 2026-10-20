using MedSlot.Api.Appointments;

namespace MedSlot.Api.BackgroundJobs
{
    public class ReleaseUnpaidAppointmentsJob
    {
        private readonly IAppointmentService _appointmentService;
        public ReleaseUnpaidAppointmentsJob(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        public async Task RunAsync()
        {
            await _appointmentService.ReleaseUnpaidAppointmentsAsync();
        }
    }
}