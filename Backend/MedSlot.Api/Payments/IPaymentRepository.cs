using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Models;

namespace MedSlot.Api.Payments
{
    public interface IPaymentRepository
    {
        Task<Doctor> GetDoctorByAppoinmentIdAsync(Guid appointmentId);
        Task CreatePaymentRowAsync(BookAppointmentResponse appointmentResponse, Doctor doctor);
    }
}
