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

            var appointmentStatusId = await _context.AppointmentStatuses.Where(status => status.StatusName == "Confirmed").Select(status => status.Id).FirstOrDefaultAsync();

            var appointment = new Appointment
            {
                Id = Guid.NewGuid(),
                TimeSlotId = slotId,
                PatientId = patientId,
                AppointmentStatusId = appointmentStatusId,
                BookedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                PatientConcern = request.PatientConcern
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
                                     .ToListAsync();

            return appointments;
        }
    }
}
