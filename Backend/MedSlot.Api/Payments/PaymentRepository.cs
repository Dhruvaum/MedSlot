using System.Numerics;
using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Data;
using MedSlot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedSlot.Api.Payments
{
    public class PaymentRepository: IPaymentRepository
    {
        private readonly MedSlotDbContext _context;

        public PaymentRepository(MedSlotDbContext context)
        {
            _context = context;
        }

        public async Task<Doctor> GetDoctorByAppoinmentIdAsync(Guid appointmentId)
        {
            var doctor = await _context.Appointments
                .Where(a => a.Id == appointmentId)
                .Select(a => a.TimeSlot.Doctor)
                .FirstOrDefaultAsync();

            return doctor;
        }
        
        public async Task CreatePaymentRowAsync(BookAppointmentResponse appointmentResponse, Doctor doctor)
        {
            var newPaymentStatusId = await _context.PaymentStatuses
                .Where(ps => ps.StatusName == "Created")
                .Select(ps => ps.Id)
                .FirstOrDefaultAsync();

            if (newPaymentStatusId == null) throw new InvalidOperationException("Payment Status could not be resolved");

            var paymentRow = new Payment
            {
                Id = Guid.NewGuid(),
                AppointmentId = appointmentResponse.AppointmentId,
                Amount = doctor.ConsultationFee!.Value,
                PaymentStatusId = newPaymentStatusId,
                CreatedAt = DateTime.UtcNow,
            };

            await _context.Payments.AddAsync(paymentRow);
            await _context.SaveChangesAsync();
        }
    }
}
