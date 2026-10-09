namespace MedSlot.Api.Doctors.Dtos
{
    public class CompleteProfileRequest
    {
        public string FullName { get; set; }
        public string Phone { get; set; }
        public Guid SpecializationId { get; set; }
        public Guid QualificationId { get; set; }
        public string RegistrationNumber { get; set; }
        public Guid RegisteringCouncilId { get; set; }
        public string WorkAddress { get; set; }
    }
}
