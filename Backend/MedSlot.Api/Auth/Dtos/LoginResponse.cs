namespace MedSlot.Api.Auth.Dtos
{
    public class LoginResponse
    {
        public string AuthToken { get; set; }
        public bool IsRegistrationCompleted { get; set; }
    }
}
