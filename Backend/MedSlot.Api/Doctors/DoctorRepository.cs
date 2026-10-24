using MedSlot.Api.Data;
using MedSlot.Api.Doctors.Dtos;
using MedSlot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedSlot.Api.Doctors
{
    public class DoctorRepository: IDoctorRepository
    {
        private readonly MedSlotDbContext _context;

        public DoctorRepository(MedSlotDbContext context)
        {
            _context = context;
        }

        public async Task AddDoctorAsync(Doctor doctor)
        {
            await _context.Doctors.AddAsync(doctor);
        }

        public async Task MarkUserRegistrationCompleteAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            user.IsRegistrationCompleted = true;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<List<Specialization>> GetAllSpecializationsAsync()
        {
            var specializations = await _context.Specializations.ToListAsync();
            return specializations;
        }

        public async Task<List<Qualification>> GetAllQualificationsAsync()
        {
            return await _context.Qualifications.ToListAsync();
        }

        public async Task<List<RegisteringCouncil>> GetAllRegisteringCouncilsAsync()
        {
            return await _context.RegisteringCouncils.ToListAsync();
        }

        public async Task<List<Doctor>> GetVerifiedDoctorsAsync()
        {
            var doctors = await _context.Doctors.Where(d => d.VerificationStatus == 1).ToListAsync();
            return doctors;
        }

        public async Task<(List<Doctor> Items, int TotalCount)> GetDoctorsListingAsync(GetDoctorsListingRequest request)
        {
            //Get Queriable Doctor Data

            var query = _context.Doctors
                .Include(d => d.Specialization)
                .Include(d => d.Qualification)
                .Where(d => d.VerificationStatus == 1)
                .AsQueryable();

            //Filter Data

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(d => d.FullName.Contains(request.Search));
            }
            if(request.SpecializationId is not null)
            {
                query = query.Where(d => d.SpecializationId == request.SpecializationId);
            }
            if(request.QualificationId is not null)
            {
                query = query.Where(d => d.QualificationId == request.QualificationId);
            }
            if(request.consultationFee is not null)
            {
                query = query.Where(d => d.ConsultationFee == request.consultationFee);
            }

            // Get Total count

            var totalCount = await query.CountAsync();

            var items = await query.Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize).ToListAsync();

            // Prepare Response

            return (items, totalCount);
        }
        
        public async Task MarkAppointmentOutcomeAsync(Guid doctorId, Guid appointmentId, string outcome)
        {
            // Validate
            
            var appointment = await _context.Appointments
                .Include(a => a.TimeSlot)
                .Include(a => a.AppointmentStatus)
                .Where(a => a.Id == appointmentId
                    && a.TimeSlot.DoctorId == doctorId
                    && DateTime.UtcNow >= a.TimeSlot.EndTime
                    && a.AppointmentStatus.StatusName == "Confirmed"
                )
                .FirstOrDefaultAsync();

            if (appointment == null) throw new InvalidOperationException("An Error Occured. Status update could not be processed for this appointment");

            if (outcome != "Completed" && outcome != "NoShow") throw new InvalidOperationException("Invalid Status Update Request");

            Guid outcomeStatusId = outcome == "Completed"
                ? await _context.AppointmentStatuses.Where(a => a.StatusName == "Completed").Select(a => a.Id).FirstOrDefaultAsync()
                : outcome == "NoShow"
                ? await _context.AppointmentStatuses.Where(a => a.StatusName == "NoShow").Select(a => a.Id).FirstOrDefaultAsync()
                : Guid.Empty;

            if (outcomeStatusId == Guid.Empty) throw new InvalidDataException();

            appointment.AppointmentStatusId = outcomeStatusId;

            await _context.SaveChangesAsync();
        }

        public async Task<Doctor> GetDoctorByIdAsync(Guid doctorId)
        {
            var query = _context.Doctors
                .Include(d => d.Specialization)
                .Include(d => d.Qualification)
                .Include(d => d.RegisteringCouncil)
                .Where(d => d.Id == doctorId);

            var doctor = await query.FirstOrDefaultAsync();

            return doctor;
        }

        public async Task<(List<Appointment> Items, int Count)> GetDoctorAppointmentsAsync(Guid doctorId, GetDoctorAppoinmentsRequest request)
        {
            var query = _context.Appointments
                .Include(a => a.TimeSlot)
                .Include(a => a.Patient)
                .Include(a => a.AppointmentStatus)
                .Where(a => a.TimeSlot.DoctorId == doctorId)
                .OrderByDescending(a => a.CreatedAt)
                .AsQueryable();

            // Filters
            if (request.Status != null)
            {
                query = query.Where(a => a.AppointmentStatusId == request.Status);
            }
            if (request.Date != null)
            {
                query = query.Where(a => a.TimeSlot.StartTime == request.Date);
            }

            var count = await query.CountAsync();
            var items = await query.Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize).ToListAsync();

            return (items, count);
        }

        public async Task SetAvailabilityAsync(Guid doctorId, int consultDurationMinutes, decimal consultationFee, List<DoctorAvailability> newRows)
        {
            var existingRows = await _context.DoctorAvailabilities
                .Where(a => a.DoctorId == doctorId)
                .ToListAsync();

            _context.DoctorAvailabilities.RemoveRange(existingRows);

            // Set ConsultaionTime
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Id == doctorId);
            doctor.ConsultDurationMinutes = consultDurationMinutes;
            doctor.ConsultationFee = consultationFee;

            await _context.DoctorAvailabilities.AddRangeAsync(newRows);
            await _context.SaveChangesAsync();
        }

        public async Task<(List<DoctorAvailability> availabilities, int? ConsultDurationMinutes, decimal? ConsultationFee)> GetAvailabilityByDoctorIdAsync(Guid doctorId)
        {
            var availabilities = await _context.DoctorAvailabilities.Where(a => a.DoctorId == doctorId).ToListAsync();
            Doctor doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Id == doctorId);

            return (availabilities, doctor?.ConsultDurationMinutes, doctor?.ConsultationFee);
        }
    }
}
