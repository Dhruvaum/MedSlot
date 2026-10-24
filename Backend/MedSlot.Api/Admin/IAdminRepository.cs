using MedSlot.Api.Models;

namespace MedSlot.Api.Admin
{
    public interface IAdminRepository
    {
        Task<List<Doctor>> GetPendingDoctorVerificationsAsync();
        Task VerifyDoctorAsync(Guid doctorId);
    }
}
