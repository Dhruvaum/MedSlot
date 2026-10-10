using MedSlot.Api.Common.Dtos;
using MedSlot.Api.Doctors.Dtos;
using MedSlot.Api.Models;

namespace MedSlot.Api.Doctors
{
    public interface IDoctorService
    {
        public Task<List<Specialization>> GetSpecializationOptionsAsync();
        public Task<List<Qualification>> GetQualificationOptionsAsync();
        public Task<List<RegisteringCouncil>> GetRegisteringCouncilOptionsAsync();
        public Task<CompleteProfileResponse> CompleteProfileAsync(CompleteProfileRequest request);
        public Task<PagedResponse<DoctorSummaryResponse>> GetDoctorsListingAsync(GetDoctorsListingRequest request);
        public Task<ViewDoctorProfileResponse> ViewDoctorProfileAsync(Guid Id);
        public Task<ViewDoctorProfileResponse> ViewMyProfileAsync();

    }
}
