namespace MedSlot.Api.Common
{
    public interface ICurrentUser
    {
        Guid? UserId { get; }
        string? Role { get; }
        bool IsAuthenticated { get; }
    }
}
