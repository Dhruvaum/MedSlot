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
        
        public async Task CreatePaymentRowAsync(BookAppointmentResponse appointmentResponse, Doctor doctor, string orderId)
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
                GatewayOrderId = orderId,
                CreatedAt = DateTime.UtcNow,
            };

            await _context.Payments.AddAsync(paymentRow);
            await _context.SaveChangesAsync();
        }

        public async Task MarkPaymentCaptured(string orderId, string paymentId)
        {
            var paymentRow = await _context.Payments.Where(p => p.GatewayOrderId == orderId).FirstOrDefaultAsync();
            var capturedPaymentStatusId = await _context.PaymentStatuses.Where(ps => ps.StatusName == "Captured").Select(ps => ps.Id).FirstOrDefaultAsync();

            var paymentAttempt = new PaymentAttempt
            {
                Id = Guid.NewGuid(),
                PaymentId = paymentRow.Id,
                GatewayPaymentId = paymentId,
                PaymentStatusId = capturedPaymentStatusId,
                AttemptedAt = DateTime.UtcNow
            };

            var appointment = await _context.Payments.Where(p => p.Id == paymentRow.Id).Select(p => p.Appointment).FirstOrDefaultAsync();
            var appointmentStatusId = await _context.AppointmentStatuses.Where(ast => ast.StatusName == "Confirmed").Select(ast => ast.Id).FirstOrDefaultAsync();

            await _context.PaymentAttempts.AddAsync(paymentAttempt);
            paymentRow.PaymentStatusId = capturedPaymentStatusId;
            appointment.AppointmentStatusId = appointmentStatusId;
            appointment.BookedAt = DateTime.UtcNow;
            appointment.HoldExpiresAt = null;

            await _context.SaveChangesAsync();
        }
    }
}
