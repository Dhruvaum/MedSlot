namespace MedSlot.Api.Patients.Dtos
{
    public class ViewPatientProfileResponse
    {
        public string FullName { get; set; }
        public DateOnly Dob { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }
}
