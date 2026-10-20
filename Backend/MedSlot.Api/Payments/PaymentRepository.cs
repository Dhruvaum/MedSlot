using System.Numerics;
using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Data;
using MedSlot.Api.Models;
using MedSlot.Api.Payments.Dtos;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Cms;

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

        public async Task MarkPaymentCaptured(string orderId, string paymentId, string? referenceNumber)
        {
            var paymentRow = await _context.Payments.Where(p => p.GatewayOrderId == orderId).FirstOrDefaultAsync();
            var capturedPaymentStatusId = await _context.PaymentStatuses.Where(ps => ps.StatusName == "Captured").Select(ps => ps.Id).FirstOrDefaultAsync();

            var paymentAttempt = new PaymentAttempt
            {
                Id = Guid.NewGuid(),
                PaymentId = paymentRow.Id,
                GatewayPaymentId = paymentId,
                PaymentStatusId = capturedPaymentStatusId,
                AttemptedAt = DateTime.UtcNow,
                ReferenceNumber = referenceNumber ?? null
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

        public async Task<(List<PaymentAttempt> Items, int Count)> GetPatientPaymentsAsync(Guid patientId, GetTransactionsListingRequest request)
        {
            var query = _context.PaymentAttempts
                .Include(pa => pa.Payment)
                .Include(pa => pa.Payment.Appointment)
                .Include(pa => pa.Payment.Appointment.TimeSlot)
                .Include(pa => pa.Payment.Appointment.TimeSlot.Doctor)
                .Where(pa => pa.Payment.Appointment.PatientId == patientId)
                .OrderByDescending(pa => pa.AttemptedAt)
                .AsQueryable();

            // Filters
            if(request.PaymentStatus != null)
            {
                query = query.Where(pa => pa.PaymentStatusId == request.PaymentStatus);
            }
            if(request.Date != null)
            {
                query = query.Where(pa => pa.AttemptedAt == request.Date);
            }

            // Count
            var count = await query.CountAsync();

            // Pagination
            var items = await query.Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize).ToListAsync();

            return (items, count);
        }

        public async Task<List<TransactionSummaryResponse>> MapTransactionsToDtoAsync(List<PaymentAttempt> transactions)
        {

            var paymentStatuses = await _context.PaymentStatuses.ToListAsync();

            var summarizedTransactions = transactions.Select(t => new TransactionSummaryResponse
            {
                Id = t.Id,
                TransactionAmount = t.Payment.Amount,
                TransactionDate = t.AttemptedAt,
                TransactionStatus = paymentStatuses.Where(ps => ps.Id == t.PaymentStatusId).Select(ps => ps.StatusName).FirstOrDefault(),
                ReferenceNumber = t.ReferenceNumber,
                AppointmentDate = (DateTime)t.Payment.Appointment.TimeSlot.StartTime,
                SlotStartTime = t.Payment.Appointment.TimeSlot.StartTime,
                SlotEndTime = t.Payment.Appointment.TimeSlot.EndTime,
                Concern = t.Payment.Appointment.PatientConcern,
                DoctorName = t.Payment.Appointment.TimeSlot.Doctor.FullName
            }).ToList();

            return summarizedTransactions;
        }

        public async Task<List<PaymentStatusOptionResponse>> GetAllPaymentStatusesAsync()
        {
            return await _context.PaymentStatuses
                .Select(ps => new PaymentStatusOptionResponse { Id = ps.Id, Name = ps.StatusName })
                .ToListAsync();
        }

        public async Task<ResumeBookingPaymentResponse> GetRazorPayOptionsByAppointmentAsync(Guid appointmentId, string keyId)
        {
            var pendingAppointment = await _context.Appointments
                .Include(a => a.Payment)
                .Where(a => a.Id == appointmentId && DateTime.UtcNow <= a.HoldExpiresAt)
                .FirstOrDefaultAsync();

            if (pendingAppointment == null) throw new NullReferenceException();

            // Extract GatewayOrderId and Amount
            return new ResumeBookingPaymentResponse
            {
                RazorpayKeyId = keyId,
                Amount = pendingAppointment.Payment.Amount,
                RazorpayOrderId = pendingAppointment.Payment.GatewayOrderId
            };

        }
    }
}
