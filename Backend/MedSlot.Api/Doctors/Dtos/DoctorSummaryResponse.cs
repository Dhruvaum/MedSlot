namespace MedSlot.Api.Doctors.Dtos
{
    public class DoctorSummaryResponse
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string? SpecializationName { get; set; }
        public string? QualificationName { get; set; }
        public decimal? ConsultationFee { get; set; }
        public string WorkAddress { get; set; }
    }
}
