using MedSlot.Api.Doctors.Dtos;
using MedSlot.Api.Models;

namespace MedSlot.Api.Doctors
{
    public interface IDoctorRepository
    {
        public Task<(List<Doctor> Items, int TotalCount)> GetDoctorsListingAsync(GetDoctorsListingRequest request);
        public Task<Doctor> GetDoctorByIdAsync(Guid Id);
    }
}
