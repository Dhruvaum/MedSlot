using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Data;
using MedSlot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedSlot.Api.Appointments
{
    public class AppointmentRepository: IAppointmentRepository
    {
        private MedSlotDbContext _context;

        public AppointmentRepository(MedSlotDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckIfSlotExistsAsync(Guid timeSlotId)
        {
            var slotExists = await _context.TimeSlots.FirstOrDefaultAsync(ts => ts.Id == timeSlotId);
            return slotExists != null ? true : false;
        }

        public async Task<bool> CheckIfSlotAlreadyBooked(Guid timeSlotId)
        {
            var slotBooked = await _context.TimeSlots.FirstOrDefaultAsync(ts => ts.Id == timeSlotId && ts.IsBooked == true);
            if (slotBooked != null) return true;
            else return false;
        }

        public async Task<BookAppointmentResponse> BookAppointmentAsync(Guid patientId, BookAppointmentRequest request)
        {
            var slotId = request.TimeSlotId;

            // Mark the row as booked
            var slot = await _context.TimeSlots.FirstOrDefaultAsync(ts => ts.Id == slotId);

            slot.IsBooked = true;

            // Create new appointment Row

            var appointmentStatusId = await _context.AppointmentStatuses.Where(status => status.StatusName == "PendingPayment").Select(status => status.Id).FirstOrDefaultAsync();

            var appointment = new Appointment
            {
                Id = Guid.NewGuid(),
                TimeSlotId = slotId,
                PatientId = patientId,
                AppointmentStatusId = appointmentStatusId,
                CreatedAt = DateTime.UtcNow,
                PatientConcern = request.PatientConcern,
                HoldExpiresAt = DateTime.UtcNow.AddMinutes(10),
            };

            await _context.Appointments.AddAsync(appointment);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new InvalidOperationException("This slot was just booked by someone else. Please choose another slot.");
            }
            catch (DbUpdateException)
            {
                throw new InvalidOperationException("This slot was just booked by someone else. Please choose another slot.");
            }

            return new BookAppointmentResponse { AppointmentId = appointment.Id, StartTime = slot.StartTime, EndTime = slot.EndTime };
        }

        public async Task<List<Appointment>> GetMyAppointmentsAsync(Guid patientId)
        {
            var appointments = await _context.Appointments
                                     .Where(a => a.PatientId == patientId)
                                     .Include(a => a.TimeSlot)
                                     .ThenInclude(ts => ts.Doctor)
                                     .ThenInclude(d => d.Specialization)
                                     .Include(a => a.AppointmentStatus)
                                     .OrderByDescending(a => a.CreatedAt)
                                     .ToListAsync();

            return appointments;
        }

        public async Task<string> DetermineCancellationCaseAsync(Guid patientId, Guid appointmentId)
        {
            // Rules:
            // Case 1: Cancel without Refund => [Appointment Status = PendingPayment, PaymentStatus = Created]
            // Case 2: Cancel with Refund => [Appointment Status = Confirmed, PaymentStatus = Captured]
            
            bool validated = false;

            var appointment = await _context.Appointments
                .Include(a => a.TimeSlot)
                .Include(a => a.Payment)
                .Where(a => a.Id == appointmentId && a.PatientId == patientId)
                .FirstOrDefaultAsync();

            if (appointment is not null) validated = true;

            if (validated == false) throw new InvalidOperationException();

            // Check Status to determine case --

            var appointmentStatusName = appointment.AppointmentStatus.StatusName;
            var paymentStatusName = appointment.Payment.PaymentStatus.StatusName;

            if (appointmentStatusName == "PendingPayment" && paymentStatusName == "Created") return "JustCancelNoRefund";
            else if (appointmentStatusName == "Confirmed" && paymentStatusName == "Captured") return "InitiateRefundAndCancel";

            return null;
        }

        public async Task<CancelAppointmentResponse> InitiateNoRefundAppointmentCansellation(Guid patientId, Guid appointmentId, bool? confirmCancel)
        {
            var appointment = await _context.Appointments
                .Include(a => a.TimeSlot)
                .Include(a => a.Payment)
                .Where(a => a.Id == appointmentId)
                .FirstOrDefaultAsync();

            var cancelledAppointmentStatusId = await _context.AppointmentStatuses.Where(a => a.StatusName == "Cancelled").Select(a => a.Id).FirstOrDefaultAsync();
            var failedPaymentStatusId = await _context.PaymentStatuses.Where(ps => ps.StatusName == "Failed").Select(ps => ps.Id).FirstOrDefaultAsync();

            appointment.Payment.PaymentStatusId = failedPaymentStatusId;
            appointment.AppointmentStatusId = cancelledAppointmentStatusId;
            appointment.HoldExpiresAt = null;
            appointment.TimeSlot.IsBooked = false;

            await _context.SaveChangesAsync();

            return new CancelAppointmentResponse { StatusCode = 200, Message = "Appointment Cancelled Successfully" };
        }

        public async Task ReleaseUnpaidAppointmentsAsync()
        {
            // Get Stauses
            var failedAppointmentStatusId = await _context.AppointmentStatuses
                .Where(ast => ast.StatusName == "PaymentFailed")
                .Select(ast => ast.Id)
                .FirstOrDefaultAsync();

            var failedPaymentStatusId = await _context.PaymentStatuses
                .Where(ps => ps.StatusName == "Failed")
                .Select(ps => ps.Id)
                .FirstOrDefaultAsync();
            
            // Get Hold Expired Appointments
            var staleAppointments = await _context.Appointments
                .Include(a => a.TimeSlot)
                .Include(a => a.Payment)
                .Where(a => a.HoldExpiresAt <= DateTime.UtcNow)
                .ToListAsync();

            // Mark Payment Rows as "Failed"
            foreach(var sa in staleAppointments)
            {
                sa.Payment.PaymentStatusId = failedPaymentStatusId;
                sa.AppointmentStatusId = failedAppointmentStatusId;
                sa.HoldExpiresAt = null;
                sa.TimeSlot.IsBooked = false;
            };

            // Save changes

            await _context.SaveChangesAsync();
        }
    }
}
