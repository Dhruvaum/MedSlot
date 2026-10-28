using MedSlot.Api.MedslotSupport.Dtos;
using MedSlot.Api.Common.Dtos;

namespace MedSlot.Api.MedslotSupport
{
    public interface ISupportService
    {
        Task<List<PendingDoctorVerificationSummary>> GetPendingDoctorVerificationsAsync();
        Task VerifyDoctorAsync(Guid doctorId);
    }
}
