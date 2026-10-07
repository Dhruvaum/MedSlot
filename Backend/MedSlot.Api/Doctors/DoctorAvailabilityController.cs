using MedSlot.Api.Doctors.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedSlot.Api.Doctors
{
    [ApiController]
    [Route("api/doctor-availability")]
    [Authorize(Roles = "Doctor")]
    public class DoctorAvailabilityController: ControllerBase
    {
        private readonly IDoctorAvailabilityService _service;

        public DoctorAvailabilityController(IDoctorAvailabilityService service)
        {
            _service = service;
        }

        [HttpPost("setDoctorAvailability")]
        public async Task<ActionResult> SetAvailability(SetDoctorAvailabilityRequest request)
        {
            await _service.SetAvailabilityAsync(request);
            return Ok();
        }

        [HttpGet("getDoctorAvailability")]
        public async Task<ActionResult<DoctorAvailabilityResponse>> GetAvailability()
        {
            var response = await _service.GetAvailabilityAsync();
            return Ok(response);
        }
    }
}
