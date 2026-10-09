using MedSlot.Api.Doctors.Dtos;
using MedSlot.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedSlot.Api.Common.Dtos;

namespace MedSlot.Api.Doctors
{
    [ApiController]
    [Route("api/doctors")]
    public class DoctorController: ControllerBase
    {
        private IDoctorService _doctorService;

        public DoctorController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        [HttpGet("getSpecializationOptions")]
        [Authorize(Roles = "Patient,Doctor")]
        public async Task<List<Specialization>> GetSpecializationOptions()
        {
            var response = await _doctorService.GetSpecializationOptionsAsync();
            return response;
        }

        [HttpGet("getQualificationOptions")]
        [Authorize(Roles = "Patient,Doctor")]
        public async Task<List<Qualification>> GetQualificationOptions()
        {
            var response = await _doctorService.GetQualificationOptionsAsync();
            return response;
        }

        [HttpGet("getRegisteringCouncilOptions")]
        [Authorize(Roles = "Patient,Doctor")]
        public async Task<List<RegisteringCouncil>> GetRegisteringCouncilOptions()
        {
            var response = await _doctorService.GetRegisteringCouncilOptionsAsync();
            return response;
        }

        [HttpPost("complete-profile")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<CompleteProfileResponse>> CompleteProfileAsync(CompleteProfileRequest request)
        {
            var response = await _doctorService.CompleteProfileAsync(request);
            return Ok(response);
        }

        [HttpPost("getDoctorsListing")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<PagedResponse<DoctorSummaryResponse>>> GetDoctorsListing(GetDoctorsListingRequest request)
        {
            var response = await _doctorService.GetDoctorsListingAsync(request);
            return Ok(response);
        }

        [HttpGet("viewDoctorProfile")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<ViewDoctorProfileResponse>> ViewDoctorProfile(Guid doctorId)
        {
            var response = await _doctorService.ViewDoctorProfileAsync(doctorId);
            return Ok(response);
        }
    }
}
