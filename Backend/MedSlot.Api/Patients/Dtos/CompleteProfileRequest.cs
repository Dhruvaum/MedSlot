namespace MedSlot.Api.Patients.Dtos
{
    public class CompleteProfileRequest
    {
        public string FullName { get; set; }
        public DateOnly Dob { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }

    }
}
