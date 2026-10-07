using MedSlot.Api.Common.Dtos;
using MedSlot.Api.Doctors.Dtos;
using MedSlot.Api.Models;

namespace MedSlot.Api.Doctors
{
    public interface IDoctorService
    {
        public Task<PagedResponse<DoctorSummaryResponse>> GetDoctorsListingAsync(GetDoctorsListingRequest request);
        public Task<ViewDoctorProfileResponse> ViewDoctorProfileAsync(Guid Id);

    }
}
