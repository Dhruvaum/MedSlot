using MedSlot.Api.Common.Dtos;
using MedSlot.Api.Payments.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedSlot.Api.Payments
{
    [ApiController]
    [Route("api/payments")]
    [Authorize(Roles = "Patient")]
    public class PaymentController: ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("verifyPayment")]
        public async Task<ActionResult> VerifyPayment(VerifyPaymentRequest request)
        {
            await _paymentService.VerifyPaymentAsync(request);
            return Ok();
        }

        [HttpGet("resumeBookingPayment")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<ResumeBookingPaymentResponse>> ResumeBookingPayment([FromQuery] Guid appointmentId)
        {
            var response = await _paymentService.ResumeBookingPaymentAsync(appointmentId);
            return Ok(response);
        }

        [HttpPost("getPatientTransactionsListing")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<PagedResponse<TransactionSummaryResponse>>> GetPatientTransactionsListing(GetTransactionsListingRequest request)
        {
            var response = await _paymentService.GetPatientTransactionsListingAsync(request);
            return Ok(response);
        }

        [HttpGet("getPaymentStatusOptions")]
        public async Task<ActionResult<List<PaymentStatusOptionResponse>>> GetPaymentStatusOptions()
        {
            var response = await _paymentService.GetPaymentStatusOptionsAsync();
            return Ok(response);
        }
    }
}
