namespace MedSlot.Api.Doctors.Dtos
{
    public class ViewDoctorProfileResponse
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string? SpecializationName { get; set; }
        public string? QualificationName { get; set; }
        public string RegistrationNumber { get; set; } = null!;
        public string RegisteringCouncil { get; set; } = null!;
        public string WorkAddress { get; set; } = null!;
    }
}
