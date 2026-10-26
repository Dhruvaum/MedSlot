using MedSlot.Api.Auth;
using MedSlot.Api.Common;
using MedSlot.Api.Common.Dtos;
using MedSlot.Api.Doctors.Dtos;
using MedSlot.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MedSlot.Api.Doctors
{
    public class DoctorService: IDoctorService, IDoctorAvailabilityService
    {
        private IDoctorRepository _doctorRepository;
        private readonly ICurrentUser _currentUser;
        private readonly ITokenService _tokenService;

        public DoctorService(IDoctorRepository doctorRepository, ICurrentUser currentUser, ITokenService tokenService)
        {
            _doctorRepository = doctorRepository;
            _currentUser = currentUser;
            _tokenService = tokenService;
        }

        public async Task<List<Specialization>> GetSpecializationOptionsAsync()
        {
            var specializations = await _doctorRepository.GetAllSpecializationsAsync();
            return specializations;
        }

        public async Task<List<Qualification>> GetQualificationOptionsAsync()
        {
            return await _doctorRepository.GetAllQualificationsAsync();
        }

        public async Task<List<RegisteringCouncil>> GetRegisteringCouncilOptionsAsync()
        {
            return await _doctorRepository.GetAllRegisteringCouncilsAsync();
        }

        public async Task<CompleteProfileResponse> CompleteProfileAsync(CompleteProfileRequest request)
        {
            var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();
            var doctorId = Guid.NewGuid();

            var doctor = new Doctor
            {
                Id = doctorId,
                UserId = userId,
                FullName = request.FullName,
                Phone = request.Phone,
                SpecializationId = request.SpecializationId,
                QualificationId = request.QualificationId,
                RegistrationNumber = request.RegistrationNumber,
                RegisteringCouncilId = request.RegisteringCouncilId,
                WorkAddress = request.WorkAddress,
                VerificationStatus = 0
            };

            await _doctorRepository.AddDoctorAsync(doctor);
            await _doctorRepository.MarkUserRegistrationCompleteAsync(userId);
            await _doctorRepository.SaveChangesAsync();

            var token = _tokenService.GenerateToken(userId, "Doctor", new Claim("doctorId", doctorId.ToString()));

            return new CompleteProfileResponse { AuthToken = token };

        }

        public async Task<PagedResponse<DoctorSummaryResponse>> GetDoctorsListingAsync(GetDoctorsListingRequest request)
        {
            // Get all doctors
            var (doctors, totalCount) = await _doctorRepository.GetDoctorsListingAsync(request);

            // Map all doctors to doctorDTO for Listing Scope
            var mappedDoctors = doctors.Select(d => new DoctorSummaryResponse
            {
                Id = d.Id,
                FullName = d.FullName,
                SpecializationName = d.Specialization?.Name,
                QualificationName = d.Qualification?.Name,
                ConsultationFee = d.ConsultationFee,
                WorkAddress = d.WorkAddress
            }).ToList();

            var response = new PagedResponse<DoctorSummaryResponse>
            {
                Items = mappedDoctors,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalCount = totalCount
            };

            return response;
        }

        public async Task<ViewDoctorProfileResponse> ViewDoctorProfileAsync(Guid doctorId)
        {
            // Get doctor by Id
            var doctorData = await _doctorRepository.GetDoctorByIdAsync(doctorId);

            // Map doctorData with Response Model
            return MapToViewDoctorProfileResponse(doctorData);
        }

        public async Task<ViewDoctorProfileResponse> ViewMyProfileAsync()
        {
            // Get doctor by Id
            var doctorId = _currentUser.DoctorId ?? throw new UnauthorizedAccessException();
            var doctorData = await _doctorRepository.GetDoctorByIdAsync(doctorId);

            // Map doctorData with Response Model
            return MapToViewDoctorProfileResponse(doctorData);
        }

        public async Task<PagedResponse<DoctorAppointmentSummary>> GetDoctorAppointmentsAsync(GetDoctorAppoinmentsRequest request)
        {
            var doctorId = _currentUser.DoctorId ?? throw new UnauthorizedAccessException();

            var (Items, Count) = await _doctorRepository.GetDoctorAppointmentsAsync(doctorId, request);

            // Map

            var mappedAppointments = Items.Select(a => new DoctorAppointmentSummary
            {
                Id = a.Id,
                PatientName = a.Patient.FullName,
                StartTime = a.TimeSlot.StartTime,
                EndTime = a.TimeSlot.EndTime,
                Status = a.AppointmentStatus.StatusName,
                Concern = a.PatientConcern
            }).ToList();

            return new PagedResponse<DoctorAppointmentSummary>
            {
                Items = mappedAppointments,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalCount = Count
            };
        }
        
        public async Task MarkAppointmentOutcomeAsync(MarkAppointmentOutcomeRequest request)
        {
            var doctorId = _currentUser.DoctorId ?? throw new UnauthorizedAccessException();

            Guid appointmentId = request.AppointmentId;
            string outcome = request.Outcome;

            await _doctorRepository.MarkAppointmentOutcomeAsync(doctorId, appointmentId, outcome);
        }

        private static ViewDoctorProfileResponse MapToViewDoctorProfileResponse(Doctor doctorData) => new()
        {
            Id = doctorData.Id,
            FullName = doctorData.FullName,
            SpecializationName = doctorData.Specialization?.Name,
            QualificationName = doctorData.Qualification?.Name,
            RegistrationNumber = doctorData.RegistrationNumber,
            RegisteringCouncil = doctorData.RegisteringCouncil?.Name,
            WorkAddress = doctorData.WorkAddress,
            VerificationStatus = doctorData.VerificationStatus,
        };


        // Doctor Availability
        public async Task SetAvailabilityAsync(SetDoctorAvailabilityRequest request)
        {
            if (request.ConsultDurationMinutes <= 0) throw new DbUpdateException("Consultation Time is required to Proceed");
            if (request.ConsultationFee <= 0) throw new DbUpdateException("Consultation Fee is required to Proceed");

            Guid doctorId = _currentUser.DoctorId ?? throw new UnauthorizedAccessException();
            
            // Map DayAvailability request to DoctorAvailability
            List<DayAvailability> days = request.Days;

            var availabilities = new List<DoctorAvailability>();

            foreach (DayAvailability day in days)
            {
                if (day.IsOff) continue;

                if(day.BreakStartTime != null && day.BreakEndTime != null)
                {
                    availabilities.Add(new DoctorAvailability
                    {
                        Id = Guid.NewGuid(),
                        DoctorId = doctorId,
                        DayOfWeek = (byte)day.DayOfWeek,
                        StartTime = day.StartTime!.Value,
                        EndTime = day.BreakStartTime!.Value,
                    });

                    availabilities.Add(new DoctorAvailability
                    {
                        Id = Guid.NewGuid(),
                        DoctorId = doctorId,
                        DayOfWeek = (byte)day.DayOfWeek,
                        StartTime = day.BreakEndTime!.Value,
                        EndTime = day.EndTime!.Value
                    });
                }
                else
                {
                    availabilities.Add(new DoctorAvailability
                    {
                        Id = Guid.NewGuid(),
                        DoctorId = doctorId,
                        DayOfWeek = (byte)day.DayOfWeek,
                        StartTime = day.StartTime!.Value,
                        EndTime = day.EndTime!.Value,
                    });
                }
            }

            await _doctorRepository.SetAvailabilityAsync(doctorId, request.ConsultDurationMinutes, request.ConsultationFee , availabilities);
        }
        public async Task<DoctorAvailabilityResponse> GetAvailabilityAsync()
        {
            Guid doctorId = _currentUser.DoctorId ?? throw new UnauthorizedAccessException();

            var (availabilities, consultDurationMinutes, ConsultationFee) = await _doctorRepository.GetAvailabilityByDoctorIdAsync(doctorId);

            var days = new List<DayAvailability>();

            // Map DoctorAvailabilities to DayAvailabilities
            foreach (DayOfWeek day in Enum.GetValues<DayOfWeek>())
            {
                var dayRows = availabilities.Where(a => (DayOfWeek)a.DayOfWeek == day)
                                            .OrderBy(a => a.StartTime)
                                            .ToList();

                if(dayRows.Count == 0)
                {
                    days.Add(new DayAvailability { DayOfWeek = day, IsOff = true });
                }

                else if(dayRows.Count == 1)
                {
                    days.Add(new DayAvailability
                    {
                        DayOfWeek = day,
                        StartTime = dayRows[0].StartTime,
                        EndTime = dayRows[0].EndTime,
                    });
                }

                else
                {
                    days.Add(new DayAvailability
                    {
                        DayOfWeek = day,
                        StartTime = dayRows[0].StartTime,
                        BreakStartTime = dayRows[0].EndTime,
                        BreakEndTime = dayRows[1].StartTime,
                        EndTime = dayRows[1].EndTime,
                    });
                }
            }

            return new DoctorAvailabilityResponse { Days = days, ConsultDurationMinutes = consultDurationMinutes , ConsultationFee = ConsultationFee};
        }


    }
}
