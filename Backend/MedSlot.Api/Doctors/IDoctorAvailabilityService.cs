using MedSlot.Api.Doctors.Dtos;

namespace MedSlot.Api.Doctors
{
    public interface IDoctorAvailabilityService
    {
        Task SetAvailabilityAsync(SetDoctorAvailabilityRequest request);
        Task<DoctorAvailabilityResponse> GetAvailabilityAsync();
    }
}
