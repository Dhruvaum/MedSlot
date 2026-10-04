using MedSlot.Api.Doctors.Dtos;
using MedSlot.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedSlot.Api.Common.Dtos;

namespace MedSlot.Api.Doctors
{
    [ApiController]
    [Route("api/doctors")]
    [Authorize(Roles = "Patient")]
    public class DoctorController: ControllerBase
    {
        private IDoctorService _doctorService;

        public DoctorController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        [HttpPost("getDoctorsListing")]
        public async Task<ActionResult<PagedResponse<DoctorSummaryResponse>>> GetDoctorsListing(GetDoctorsListingRequest request)
        {
            var response = await _doctorService.GetDoctorsListingAsync(request);
            return Ok(response);
        }

        [HttpGet("viewDoctorProfile")]
        public async Task<ActionResult<ViewDoctorProfileResponse>> ViewDoctorProfile(Guid doctorId)
        {
            var response = await _doctorService.ViewDoctorProfileAsync(doctorId);
            return Ok(response);
        }
    }
}
