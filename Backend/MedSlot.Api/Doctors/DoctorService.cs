using MedSlot.Api.Common;
using MedSlot.Api.Common.Dtos;
using MedSlot.Api.Doctors.Dtos;
using MedSlot.Api.Models;

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

            await _doctorRepository.SetAvailabilityAsync(doctorId, availabilities);
        }
        public async Task<List<DoctorAvailability>> GetAvailabilityAsync(Guid doctorId)
        {
            var availabilities = await _doctorRepository.GetAvailabilityByDoctorIdAsync(doctorId);
            return availabilities;
        }

    }
}
