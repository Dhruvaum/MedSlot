namespace MedSlot.Api.Payments.Dtos
{
    public class TransactionSummaryResponse
    {
        public Guid Id { get; set; }
        public decimal TransactionAmount { get; set; }
        public DateTime TransactionDate { get; set; }
        public string TransactionStatus { get; set; }
        public string ReferenceNumber { get; set; } = null;
        public DateTime AppointmentDate { get; set; }
        public DateTime SlotStartTime { get; set; }
        public DateTime SlotEndTime { get; set; }
        public string Concern { get; set; } = null;
        public string DoctorName { get; set; }

    }
}
