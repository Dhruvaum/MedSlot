using MedSlot.Api.Admin.Dtos;
using MedSlot.Api.Common.Dtos;

namespace MedSlot.Api.Admin
{
    public class AdminService: IAdminService
    {
        private readonly IAdminRepository _repository;

        public AdminService(IAdminRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<PendingDoctorVerificationSummary>> GetPendingDoctorVerificationsAsync()
        {
            var doctors = await _repository.GetPendingDoctorVerificationsAsync();

            var mappedPendingDoctors = doctors.Select(d => new PendingDoctorVerificationSummary
            {
                DoctorId = d.Id,
                FullName = d.FullName,
                QualificationName = d.Qualification.Name,
                RegisteringCouncilName = d.RegisteringCouncil.Name,
                RegistrationNumber = d.RegistrationNumber,
                WorkAddress = d.WorkAddress
            }).ToList();

            return mappedPendingDoctors;
        }

        public async Task VerifyDoctorAsync(Guid doctorId)
        {
            await _repository.VerifyDoctorAsync(doctorId);
        }
    }
}
