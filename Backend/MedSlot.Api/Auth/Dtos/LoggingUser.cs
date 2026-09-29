using MedSlot.Api.Models;

namespace MedSlot.Api.Auth.Dtos
{
    public class LoggingUser
    {
        public User? user { get; set; }
        public string? userType { get; set; }
        public bool isRegistrationCompleted { get; set; } = false;
        public Guid? patientId { get; set; } = null;
        public Guid? doctorId { get; set; } = null;
    }
}
