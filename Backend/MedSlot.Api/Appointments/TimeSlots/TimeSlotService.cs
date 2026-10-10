using MedSlot.Api.Doctors;
using MedSlot.Api.Doctors.Dtos;
using MedSlot.Api.Models;

namespace MedSlot.Api.Appointments.TimeSlots
{
    public class TimeSlotService: ITimeSlotService
    {
        private readonly ITimeSlotRepository _repository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly int window = 14;

        public TimeSlotService(ITimeSlotRepository repository, IDoctorRepository doctorRepository)
        {
            _repository = repository;
            _doctorRepository = doctorRepository;
        }

        public async Task GenerateSlotsAsync()
        {
            var doctors = await _doctorRepository.GetVerifiedDoctorsAsync();
            if (doctors == null || doctors.Count == 0) return;

            var today = DateTime.UtcNow.Date;
            var targetDate = today.AddDays(window - 1);

            foreach (var doctor in doctors)
            {
                var (availabilities, consultDurationMinutes) = await _doctorRepository.GetAvailabilityByDoctorIdAsync(doctor.Id);

                if (availabilities == null || !availabilities.Any()) continue;
                if (consultDurationMinutes is null) continue;

                var lastSlotDate = await _repository.GetLastSlotDate(doctor.Id);
                var startDate = lastSlotDate?.AddDays(1) ?? today;

                if (startDate > targetDate) continue;

                var newSlots = new List<TimeSlot>();

                for(var date = startDate; date <= targetDate; date = date.AddDays(1))
                {
                    var dayAvailabilities = availabilities.Where(a => (DayOfWeek)a.DayOfWeek == date.DayOfWeek);
                    foreach(var avail in dayAvailabilities)
                    {
                        // availability row's own start and end time
                        var availStart = date.Add(avail.StartTime.ToTimeSpan());
                        var availEnd = date.Add(avail.EndTime.ToTimeSpan());

                        // slot (unit operating as subdivisions within availability range)
                        var slotStart = availStart;

                        while(slotStart.AddMinutes(consultDurationMinutes.Value) <= availEnd)
                        {
                            var slotEnd = slotStart.AddMinutes(consultDurationMinutes.Value);

                            newSlots.Add(new TimeSlot
                            {
                                Id = Guid.NewGuid(),
                                DoctorId = doctor.Id,
                                StartTime = slotStart,
                                EndTime = slotEnd,
                                IsBooked = false,
                                CreatedAt = DateTime.UtcNow
                            });

                            slotStart = slotEnd;
                        }
                    }
                }

                if (newSlots.Count > 0) await _repository.AddTimeSlotsAsync(newSlots);

            }

        }

    }
}
