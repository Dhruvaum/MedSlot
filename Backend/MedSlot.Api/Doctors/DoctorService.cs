using MedSlot.Api.Common;
using MedSlot.Api.Common.Dtos;
using MedSlot.Api.Doctors.Dtos;
using MedSlot.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MedSlot.Api.Doctors
{
    public class DoctorService: IDoctorService, IDoctorAvailabilityService
    {
        private IDoctorRepository _doctorRepository;
        private readonly ICurrentUser _currentUser;

        public DoctorService(IDoctorRepository doctorRepository, ICurrentUser currentUser)
        {
            _doctorRepository = doctorRepository;
            _currentUser = currentUser;
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
            var doctor = new ViewDoctorProfileResponse
            {
                Id = doctorData.Id,
                FullName = doctorData.FullName,
                SpecializationName = doctorData.Specialization?.Name,
                QualificationName = doctorData.Qualification?.Name,
                RegistrationNumber = doctorData.RegistrationNumber,
                RegisteringCouncil = doctorData.RegisteringCouncil,
                WorkAddress = doctorData.WorkAddress
            };

            return doctor;
        }

        
        // Doctor Availability
        public async Task SetAvailabilityAsync(SetDoctorAvailabilityRequest request)
        {
            if (request.ConsultDurationMinutes <= 0) throw new DbUpdateException("Consultation Time is required to Proceed");
            
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

            await _doctorRepository.SetAvailabilityAsync(doctorId, request.ConsultDurationMinutes, availabilities);
        }
        public async Task<DoctorAvailabilityResponse> GetAvailabilityAsync()
        {
            Guid doctorId = _currentUser.DoctorId ?? throw new UnauthorizedAccessException();

            var (availabilities, consultDurationMinutes) = await _doctorRepository.GetAvailabilityByDoctorIdAsync(doctorId);

            if (consultDurationMinutes == null && availabilities.Count == 0) return new DoctorAvailabilityResponse { Days = null, ConsultDurationMinutes = 0 };
            else if (consultDurationMinutes != null && availabilities.Count == 0) return new DoctorAvailabilityResponse { Days = null, ConsultDurationMinutes = consultDurationMinutes };

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

            return new DoctorAvailabilityResponse { Days = days, ConsultDurationMinutes = consultDurationMinutes };
        }

    }
}
