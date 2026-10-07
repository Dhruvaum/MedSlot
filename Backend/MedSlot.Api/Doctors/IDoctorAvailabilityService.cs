using MedSlot.Api.Doctors.Dtos;

namespace MedSlot.Api.Doctors
{
    public interface IDoctorAvailabilityService
    {
        Task SetAvailabilityAsync(Guid doctorId, SetDoctorAvailabilityRequest request);
        Task<DoctorAvailabilityResponse> GetAvailabilityAsync(Guid doctorId);
    }
}
