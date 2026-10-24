using MedSlot.Api.Admin.Dtos;
using MedSlot.Api.Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedSlot.Api.Admin
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController: ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("getPendingVerifications")]
        public async Task<ActionResult<List<PendingDoctorVerificationSummary>>> GetPendingVerifications()
        {
            var response = await _adminService.GetPendingDoctorVerificationsAsync();
            return Ok(response);
        }

        [HttpPost("verifyDoctor")]
        public async Task<ActionResult> VerifyDoctor(Guid doctorId)
        {
            await _adminService.VerifyDoctorAsync(doctorId);
            return Ok();
        }
    }
}
