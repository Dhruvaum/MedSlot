using MedSlot.Api.Models;

namespace MedSlot.Api.Patients
{
    public interface IPatientRepository
    {
        Task AddPatientAsync(Patient patient);
        Task SaveChangesAsync();
        Task MarkUserRegistrationCompleteAsync(Guid userId);
    }
}
