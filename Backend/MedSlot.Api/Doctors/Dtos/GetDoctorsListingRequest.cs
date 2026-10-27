namespace MedSlot.Api.Doctors.Dtos
{
    public class GetDoctorsListingRequest
    {
        public string? Search { get; set; }
        public Guid? SpecializationId { get; set; }
        public Guid? QualificationId { get; set; }
        public int? Rating { get; set; }
        public int? TotalPatientsDiagnosed { get; set; }
        public int? YearsOfExperience { get; set; }
        public decimal? MaxConsultationFee { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
