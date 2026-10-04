using MedSlot.Api.Common.Dtos;
using MedSlot.Api.Doctors.Dtos;

namespace MedSlot.Api.Doctors
{
    public class DoctorService: IDoctorService
    {
        private IDoctorRepository _doctorRepository;

        public DoctorService(IDoctorRepository doctorRepository)
        {
            _doctorRepository = doctorRepository;
        }

        public async Task<PagedResponse<DoctorSummaryResponse>> GetDoctorsListingAsync(GetDoctorsListingRequest request)
        {
            // Get all doctors
            var (doctors, totalCount) = await _doctorRepository.GetDoctorsListingAsync(request);

            // Map all doctors to doctorDTO for Listing Scope
            var mappedDoctors = doctors.Select(d => new DoctorSummaryResponse
            {
                Id = d.Id,
                FullName = d.FullName,
                SpecializationName = d.Specialization?.Name,
                QualificationName = d.Qualification?.Name,
                WorkAddress = d.WorkAddress
            }).ToList();

            var response = new PagedResponse<DoctorSummaryResponse>
            {
                Items = mappedDoctors,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalCount = totalCount
            };

            return response;
        }

        public async Task<ViewDoctorProfileResponse> ViewDoctorProfileAsync(Guid doctorId)
        {
            // Get doctor by Id
            var doctorData = await _doctorRepository.GetDoctorByIdAsync(doctorId);

            // Map doctorData with Response Model
            var doctor = new ViewDoctorProfileResponse
            {
                Id = doctorData.Id,
                FullName = doctorData.FullName,
                SpecializationName = doctorData.Specialization?.Name,
                QualificationName = doctorData.Qualification?.Name,
                RegistrationNumber = doctorData.RegistrationNumber,
                RegisteringCouncil = doctorData.RegisteringCouncil,
                WorkAddress = doctorData.WorkAddress
            };

            return doctor;
        }
    }
}
