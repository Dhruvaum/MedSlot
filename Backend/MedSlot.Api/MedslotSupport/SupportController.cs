using MedSlot.Api.MedslotSupport.Dtos;
using MedSlot.Api.Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedSlot.Api.MedslotSupport
{
    [ApiController]
    [Route("api/medslot-support")]
    [Authorize(Roles = "SupportAgent")]
    public class SupportController: ControllerBase
    {
        private readonly ISupportService _supportService;

        public SupportController(ISupportService supportService)
        {
            _supportService = supportService;
        }

        [HttpGet("getPendingVerifications")]
        public async Task<ActionResult<List<PendingDoctorVerificationSummary>>> GetPendingVerifications()
        {
            var response = await _supportService.GetPendingDoctorVerificationsAsync();
            return Ok(response);
        }

        [HttpPost("verifyDoctor")]
        public async Task<ActionResult> VerifyDoctor(Guid doctorId)
        {
            await _supportService.VerifyDoctorAsync(doctorId);
            return Ok();
        }
    }
}
