namespace MedSlot.Api.Doctors.Dtos
{
    public class GetDoctorAppoinmentsRequest
    {
        public DateTime? Date { get; set; }
        public Guid? Status { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
