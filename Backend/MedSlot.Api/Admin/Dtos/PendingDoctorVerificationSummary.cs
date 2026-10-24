namespace MedSlot.Api.Admin.Dtos
{
    public class PendingDoctorVerificationSummary
    {
        public Guid DoctorId { get; set; }
        public string FullName { get; set; }
        public string RegistrationNumber { get; set; }
        public string? QualificationName { get; set; }
        public string? RegisteringCouncilName { get; set; }
        public string WorkAddress { get; set; }
    }
}
