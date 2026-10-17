using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Common;
using MedSlot.Api.Payments;
using Microsoft.EntityFrameworkCore;

namespace MedSlot.Api.Appointments
{
    public class AppointmentService: IAppointmentService
    {
        private IAppointmentRepository _appointmentRepository;
        private IPaymentService _paymentService;
        private ICurrentUser _currentUser;

        public AppointmentService(IAppointmentRepository appointmentRepository, ICurrentUser currentUser, IPaymentService paymentService)
        {
            _appointmentRepository = appointmentRepository;
            _paymentService = paymentService;
            _currentUser = currentUser;
        }

        public async Task<BookAppointmentResponse> BookAppointmentAsync(BookAppointmentRequest request)
        {
            var slotExists = await _appointmentRepository.CheckIfSlotExistsAsync(request.TimeSlotId);
            if (slotExists == false) throw new ArgumentException("Time Slot does not exist");

            var slotAlreadyBooked = await _appointmentRepository.CheckIfSlotAlreadyBooked(request.TimeSlotId);
            if (slotAlreadyBooked == true) throw new InvalidOperationException("Slot already got booked. Please try another slot");

            var patientId = _currentUser.PatientId ?? throw new UnauthorizedAccessException();

            var bookingResponse = await _appointmentRepository.BookAppointmentAsync(patientId, request);

            // Create Payment Record
            var paymentInfo = await _paymentService.InitiatePaymentAsync(bookingResponse);

            bookingResponse.RazorpayOrderId = paymentInfo.RazorpayOrderId;
            bookingResponse.Amount = paymentInfo.Amount;
            bookingResponse.RazorpayKeyId = paymentInfo.RazorpayKeyId;

            return bookingResponse;
        }

        public async Task<AppointmentSummaryResponse> GetMyAppointmentsAsync()
        {
            var patientId = _currentUser.PatientId ?? throw new UnauthorizedAccessException();

            var appointments = await _appointmentRepository.GetMyAppointmentsAsync(patientId);

            var mappedAppointments = new List<AppointmentSummary>();
            
            foreach(var appointment in appointments)
            {
                var a = appointment;
                var doctor = a.TimeSlot.Doctor;
                var ast = a.AppointmentStatus;
                var ts = a.TimeSlot;

                var mappedAppointment = new AppointmentSummary
                {
                    Id = a.Id,
                    DoctorName = doctor.FullName,
                    SpecializationName = doctor.Specialization.Name,
                    StartTime = ts.StartTime,
                    EndTime = ts.EndTime,
                    Status = ast.StatusName,
                    BookedAt = a.BookedAt,
                    CreatedAt = a.CreatedAt,
                    Concern = a.PatientConcern
                };

                mappedAppointments.Add(mappedAppointment);
            }

            return new AppointmentSummaryResponse { Appointments = mappedAppointments };
        }
    }
}
