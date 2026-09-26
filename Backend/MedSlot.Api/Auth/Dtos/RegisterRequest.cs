namespace MedSlot.Api.Auth.Dtos
{
    public class RegisterRequest
    {
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string UserType { get; set; } = null!;
    }
}
