using MedSlot.Api.Payments.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace MedSlot.Api.Payments
{
    [ApiController]
    [Route("api/payments")]
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
    }
}
