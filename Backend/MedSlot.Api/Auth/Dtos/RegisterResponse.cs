namespace MedSlot.Api.Auth.Dtos
{
        public class RegisterResponse
        {
        public string AuthToken { get; set; } = null!;
        public string Role { get; set; } = null!;
        public bool IsRegistrationCompleted { get; set; }
    }
}
