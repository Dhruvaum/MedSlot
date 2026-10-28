using System.Numerics;
using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Data;
using MedSlot.Api.Models;
using MedSlot.Api.Payments.Dtos;
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

        public async Task<(List<PaymentAttempt> Items, List<Refund> Refunds)> GetPatientTransactionsAsync(Guid patientId, GetTransactionsListingRequest request)
        {
            var query = _context.PaymentAttempts
                .Include(pa => pa.Payment)
                    .ThenInclude(p => p.Appointment)
                        .ThenInclude(a => a.TimeSlot)
                            .ThenInclude(t => t.Doctor)
                .Where(pa => pa.Payment.Appointment.PatientId == patientId)
                .OrderByDescending(pa => pa.AttemptedAt)
                .AsQueryable();

            var refundQuery = _context.Refunds
                .Include(r => r.Payment)
                    .ThenInclude(p => p.Appointment)
                        .ThenInclude(a => a.TimeSlot)
                            .ThenInclude(t => t.Doctor)
                .Where(r => r.Payment.Appointment.PatientId == patientId)
                .OrderByDescending(r => r.RefundedAt)
                .AsQueryable();

            // Date Filter
            if(request.Date != null)
            {
                query = query.Where(pa => pa.AttemptedAt.Date == request.Date);
                refundQuery = refundQuery.Where(r => r.RefundedAt.HasValue && r.RefundedAt.Value.Date == request.Date);
            }

            List<PaymentAttempt> attempts;
            List<Refund> refunds;

            // Status Filter
            if (request.PaymentStatus != null)
            {
                var filterStatusName = await _context.PaymentStatuses
                    .Where(ps => ps.Id == request.PaymentStatus)
                    .Select(ps => ps.StatusName)
                    .FirstOrDefaultAsync();

                bool isRefundStatusFilter = filterStatusName == "Refunded" || filterStatusName == "PartiallyRefunded";

                if (isRefundStatusFilter)
                {
                    attempts = new List<PaymentAttempt>();
                    var allRefunds = await refundQuery.ToListAsync();
                    refunds = allRefunds.Where(r => (filterStatusName == "Refunded") == (r.Amount == r.Payment.Amount)).ToList();
                }
                else
                {
                    attempts = await query.Where(pa => pa.Payment.PaymentStatusId == request.PaymentStatus).ToListAsync();
                    refunds = new List<Refund>();
                }
            }
            else
            {
                attempts = await query.ToListAsync();
                refunds = await refundQuery.ToListAsync();
            }

            return (attempts, refunds);
        }

        public async Task<List<TransactionSummaryResponse>> MapTransactionsToDtoAsync(List<PaymentAttempt> attempts, List<Refund> refunds)
        {
            var paymentStatuses = await _context.PaymentStatuses.ToListAsync();

            var mappedAttempts = attempts.Select(t => new TransactionSummaryResponse
            {
                Id = t.Id,
                TransactionAmount = t.Payment.Amount,
                TransactionDate = t.AttemptedAt,
                TransactionStatus = paymentStatuses.Where(ps => ps.Id == t.PaymentStatusId).Select(ps => ps.StatusName).FirstOrDefault(),
                ReferenceNumber = t.ReferenceNumber,
                AppointmentDate = t.Payment.Appointment.TimeSlot.StartTime,
                SlotStartTime = t.Payment.Appointment.TimeSlot.StartTime,
                SlotEndTime = t.Payment.Appointment.TimeSlot.EndTime,
                Concern = t.Payment.Appointment.PatientConcern,
                DoctorName = t.Payment.Appointment.TimeSlot.Doctor.FullName
            });

            var mappedRefunds = refunds.Select(r => new TransactionSummaryResponse
            {
                Id = r.Id,
                TransactionAmount = r.Amount,
                TransactionDate = r.RefundedAt ?? r.CreatedAt,
                TransactionStatus = r.Amount == r.Payment.Amount ? "Refunded" : "PartiallyRefunded",
                ReferenceNumber = r.ReferenceNumber,
                AppointmentDate = r.Payment.Appointment.TimeSlot.StartTime,
                SlotStartTime = r.Payment.Appointment.TimeSlot.StartTime,
                SlotEndTime = r.Payment.Appointment.TimeSlot.EndTime,
                Concern = r.Payment.Appointment.PatientConcern,
                DoctorName = r.Payment.Appointment.TimeSlot.Doctor.FullName
            });

            return mappedAttempts.Concat(mappedRefunds)
                .OrderByDescending(t => t.TransactionDate)
                .ToList();
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

        public async Task<(string gatewayPaymentId, decimal amount, DateTime slotStartTime)> GetCapturedPaymentDetailsAsync(Guid appointmentId)
        {
            var appointment = await _context.Appointments
                .Where(a => a.Id == appointmentId)
                .Include(a => a.TimeSlot)
                .Include(a => a.Payment)
                .FirstOrDefaultAsync();

            var capturedAttempt = await _context.PaymentAttempts
                .Include(pa => pa.PaymentStatus)
                .Where(pa => pa.PaymentId == appointment.Payment.Id && pa.PaymentStatus.StatusName == "Captured")
                .OrderByDescending(pa => pa.AttemptedAt)
                .FirstOrDefaultAsync();

            return (capturedAttempt.GatewayPaymentId, appointment.Payment.Amount, appointment.TimeSlot.StartTime);
        }

        public async Task CreateRefundRowAndReleaseSlotAsync(Guid appointmentId, decimal refundAmount, string reason, string gatewayRefundId, string refundReferenceNumber)
        {
            var appointment = await _context.Appointments
                .Include(a => a.TimeSlot)
                .Include(a => a.Payment)
                .Where(a => a.Id == appointmentId)
                .FirstOrDefaultAsync();

            // Get Statuses
            var cancelledAppointmentStatusId = await _context.AppointmentStatuses
                .Where(a => a.StatusName == "Cancelled")
                .Select(a => a.Id)
                .FirstOrDefaultAsync();

            var refundInitiatedStatusId = await _context.PaymentStatuses
                .Where(ps => ps.StatusName == "RefundInitiated")
                .Select(ps => ps.Id)
                .FirstOrDefaultAsync();

            var refundRecord = new Refund
            {
                Id = Guid.NewGuid(),
                PaymentId = appointment.Payment.Id,
                Amount = refundAmount,
                GatewayRefundId = gatewayRefundId,
                Reason = reason,
                RefundedAt = null,
                CreatedAt = DateTime.UtcNow,
                ReferenceNumber = refundReferenceNumber
            };

            await _context.Refunds.AddAsync(refundRecord);

            appointment.Payment.PaymentStatusId = refundInitiatedStatusId;
            appointment.AppointmentStatusId = cancelledAppointmentStatusId;
            appointment.TimeSlot.IsBooked = false;

            await _context.SaveChangesAsync();
        }

        public async Task<List<Refund>> GetPendingRefundsAsync()
        {
            return await _context.Refunds
                .Include(r => r.Payment)
                .ThenInclude(p => p.PaymentStatus)
                .Where(r => r.Payment.PaymentStatus.StatusName == "RefundInitiated")
                .ToListAsync();
        }

        public async Task MarkRefundProcessedAsync(Guid refundId)
        {
            var refund = await _context.Refunds.Include(r => r.Payment).FirstOrDefaultAsync(r => r.Id == refundId);

            bool isFullRefund = refund.Amount == refund.Payment.Amount;
            var refundStatus = isFullRefund ? "Refunded" : "PartiallyRefunded";
            var paymentStatusId = await _context.PaymentStatuses.Where(ps => ps.StatusName == refundStatus).Select(ps => ps.Id).FirstOrDefaultAsync();

            refund.RefundedAt = DateTime.UtcNow;
            refund.Payment.PaymentStatusId = paymentStatusId;

            await _context.SaveChangesAsync();
        }

        public async Task MarkRefundFailedAsync(Guid refundId)
        {
            var refund = await _context.Refunds.Include(r => r.Payment).FirstOrDefaultAsync(r => r.Id == refundId);

            var capturedStatusId = await _context.PaymentStatuses.Where(ps => ps.StatusName == "Captured").Select(ps => ps.Id).FirstOrDefaultAsync();
            refund.Payment.PaymentStatusId = capturedStatusId;

            await _context.SaveChangesAsync();
        }

        public async Task ReleaseEligibleFundsAsync()
        {
            var releasablePayments = await _context.Payments
                .Include(p => p.PaymentStatus)
                .Where(p => p.IsEligibleForRelease == true && p.PaymentStatus.StatusName == "Captured")
                .ToListAsync();

            // Mark Released At
            foreach(var payment in releasablePayments)
            {
                payment.FundsReleasedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }
    }
}
