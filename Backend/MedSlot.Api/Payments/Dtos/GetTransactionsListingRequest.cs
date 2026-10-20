namespace MedSlot.Api.Payments.Dtos
{
    public class GetTransactionsListingRequest
    {
        public Guid? PaymentStatus {  get; set; }
        public DateTime? Date { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
