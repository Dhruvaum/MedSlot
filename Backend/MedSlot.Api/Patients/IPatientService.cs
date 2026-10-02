using MedSlot.Api.Patients.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace MedSlot.Api.Patients
{
    public interface IPatientService
    {
        Task<CompleteProfileResponse> CompleteProfileAsync(CompleteProfileRequest request);
        Task<ViewProfileInfoResponse> ViewProfileInfo();
    }
}
