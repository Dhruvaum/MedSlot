using MedSlot.Api.Payments;

namespace MedSlot.Api.BackgroundJobs
{
    public class SettleRefundsJob
    {
        private readonly IPaymentService _paymentService;
        public SettleRefundsJob(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        public async Task RunAsync()
        {
            await _paymentService.SettleRefundsJobAsync();
        }
    }
}
