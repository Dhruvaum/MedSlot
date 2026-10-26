using MedSlot.Api.Payments;

namespace MedSlot.Api.BackgroundJobs
{
    public class ReleaseEligibleFundsJob
    {
        private readonly IPaymentService _paymentService;

        public ReleaseEligibleFundsJob(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        public async Task RunAsync()
        {
            await _paymentService.ReleaseEligibleFundsAsync();
        }
    }
}
