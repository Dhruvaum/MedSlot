using MedSlot.Api.MedslotSupport.Dtos;
using MedSlot.Api.Common.Dtos;

namespace MedSlot.Api.MedslotSupport
{
    public class SupportService: ISupportService
    {
        private readonly ISupportRepository _repository;

        public SupportService(ISupportRepository repository)
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
