using MedSlot.Api.Admin.Dtos;
using MedSlot.Api.Common.Dtos;

namespace MedSlot.Api.Admin
{
    public interface IAdminService
    {
        Task<List<PendingDoctorVerificationSummary>> GetPendingDoctorVerificationsAsync();
        Task VerifyDoctorAsync(Guid doctorId);
    }
}
