using MedSlot.Api.Patients.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedSlot.Api.Patients
{
    [ApiController]
    [Route("api/patients")]
    [Authorize(Roles = "Patient")]
    public class PatientController : ControllerBase
    {
        private IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpPost("complete-profile")]
        public async Task<ActionResult<CompleteProfileResponse>> CompleteProfile(CompleteProfileRequest request)
        {
            var response = await _patientService.CompleteProfileAsync(request);
            return Ok(response);
        }
    }
}
