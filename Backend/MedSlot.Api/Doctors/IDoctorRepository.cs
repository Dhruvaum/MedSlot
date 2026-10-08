using MedSlot.Api.Doctors.Dtos;
using MedSlot.Api.Models;

namespace MedSlot.Api.Doctors
{
    public interface IDoctorRepository
    {
        public Task<List<Doctor>> GetDoctorsAsync();
        public Task<(List<Doctor> Items, int TotalCount)> GetDoctorsListingAsync(GetDoctorsListingRequest request);
        public Task<Doctor> GetDoctorByIdAsync(Guid Id);

        // Doctor Availability
        public Task SetAvailabilityAsync(Guid doctorId, int consultDurationMinutes, List<DoctorAvailability> newRows);
        public Task<(List<DoctorAvailability> availabilities, int? ConsultDurationMinutes)> GetAvailabilityByDoctorIdAsync(Guid doctorId);
    }
}
