using MedSlot.Api.Common;
using MedSlot.Api.Patients.Dtos;
using MedSlot.Api.Models;
using MedSlot.Api.Auth;
using System.Security.Claims;

namespace MedSlot.Api.Patients
{
    public class PatientService : IPatientService
    {
        private readonly ICurrentUser _currentUser;
        private readonly IPatientRepository _patientRepository;
        private readonly ITokenService _tokenService;

        public PatientService(IPatientRepository patientRepository, ICurrentUser currentUser, ITokenService tokenService)
        {
            _patientRepository = patientRepository;
            _currentUser = currentUser;
            _tokenService = tokenService;
        }

        public async Task<CompleteProfileResponse> CompleteProfileAsync(CompleteProfileRequest request)
        {
            // Extract UserId from the token
            var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();

            // Create and insert patient

            var patientId = Guid.NewGuid();
            var patient = new Patient
            {
                Id = patientId,
                UserId = userId,
                FullName = request.FullName,
                Dob = request.Dob,
                Gender = request.Gender,
                Phone = request.Phone,
                Address = request.Address
            };
            
            await _patientRepository.AddPatientAsync(patient);

            // Mark User's Registration Complete
            await _patientRepository.MarkUserRegistrationCompleteAsync(userId);

            // Save Changes
            await _patientRepository.SaveChangesAsync();

            // Renew Token (with PatientId added as a claim)

            var token = _tokenService.GenerateToken(userId, "Patient", new Claim("patientId", patientId.ToString()));

            return new CompleteProfileResponse
            {
                AuthToken = token
            };
        }
    }
}
