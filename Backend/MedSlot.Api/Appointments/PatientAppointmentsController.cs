using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Appointments.TimeSlots;
using MedSlot.Api.Appointments.TimeSlots.Dtos;
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
        private ITimeSlotService _timeSlotService;

        public PatientAppointmentsController(IAppointmentService appointmentService, ITimeSlotService timeSlotService)
        {
            _appointmentService = appointmentService;
            _timeSlotService = timeSlotService;
        }

        [HttpGet("getAvailableSlots")]
        public async Task<ActionResult<List<AvailableSlot>>> GetAvailableSlots([FromQuery] GetAvailableSlotsRequest request)
        {
            var response = await _timeSlotService.GetAvailableSlotsAsync(request);
            return Ok(response);
        }

        [HttpPost("bookAppointment")]
        public async Task<ActionResult<BookAppointmentResponse>> BookAppointment(BookAppointmentRequest request)
        {
            var response = await _appointmentService.BookAppointmentAsync(request);
            return Ok(response);
        }

        [HttpGet("getMyAppointments")]
        public async Task<ActionResult<AppointmentSummaryResponse>> GetMyAppointments()
        {
            var response = await _appointmentService.GetMyAppointmentsAsync();
            return Ok(response);
        }

        [HttpGet("cancelAppointment")]
        public async Task<ActionResult<CancelAppointmentResponse>> CancelAppointment([FromQuery] Guid appointmentId, Boolean? confirmCancel = false)
        {
            var response = await _appointmentService.CancelAppointmentAsync(appointmentId, confirmCancel);
            return Ok(response);
        }
    }
}
