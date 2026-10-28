using MedSlot.Api.Models;

namespace MedSlot.Api.MedslotSupport
{
    public interface ISupportRepository
    {
        Task<List<Doctor>> GetPendingDoctorVerificationsAsync();
        Task VerifyDoctorAsync(Guid doctorId);
    }
}
