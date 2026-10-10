using MedSlot.Api.Appointments.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedSlot.Api.Appointments
{
    [ApiController]
    [Route("api/patient-appointment")]
    [Authorize(Roles = "Patient")]
    public class PatientAppointmentsController: ControllerBase
    {
        private IAppointmentService _appointmentService;

        public PatientAppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpPost("bookAppointment")]
        public async Task<ActionResult<BookAppointmentResponse>> BookAppointment(BookAppointmentRequest request)
        {
            var response = await _appointmentService.BookAppointmentAsync(request);
            return Ok(response);
        }
    }
}
