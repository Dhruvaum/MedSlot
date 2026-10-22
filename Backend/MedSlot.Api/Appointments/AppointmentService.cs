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
                bool appointmentCancellable = (ast.StatusName == "PendingPayment" || ast.StatusName == "Confirmed")
                    && a.TimeSlot.StartTime - DateTime.UtcNow > TimeSpan.FromMinutes(1);

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
                    Concern = a.PatientConcern,
                    HoldExpiresAt = a.HoldExpiresAt,
                    Cancellable = appointmentCancellable
                };

                mappedAppointments.Add(mappedAppointment);
            }

            return new AppointmentSummaryResponse { Appointments = mappedAppointments };
        }

        public async Task<CancelAppointmentResponse> CancelAppointmentAsync(Guid appointmentId, Boolean? confirmCancel)
        {
            var patientId = _currentUser.PatientId ?? throw new UnauthorizedAccessException();

            string determinedCase = await _appointmentRepository.DetermineCancellationCaseAsync(patientId, appointmentId);

            if (determinedCase == null)
                return new CancelAppointmentResponse { StatusCode = 500, Message = "An enexpected error occured" };

            if(determinedCase == "JustCancelNoRefund")
                return await _appointmentRepository.InitiateNoRefundAppointmentCansellation(patientId, appointmentId, confirmCancel);

            else if(determinedCase == "InitiateRefundAndCancel")
                return await InitiateAppointmentCancellationWithRefund(patientId, appointmentId, confirmCancel);

            return new CancelAppointmentResponse { StatusCode = 500, Message = "Could not proceed with the request. Please try again later"};
        }

        private async Task<CancelAppointmentResponse> InitiateAppointmentCancellationWithRefund(Guid patientid, Guid appointmentId, bool? confirmCancel)
        {
            if (confirmCancel != true)
                return new CancelAppointmentResponse { StatusCode = 400, Message = "Confirmation Required. Please confirm once to proceed" , ConfirmationRequired = true , Case = "InitiateRefundAndCancel" };

            return await _paymentService.RefundPaymentAsync(appointmentId);
        }

        public async Task ReleaseUnpaidAppointmentsAsync()
        {
            await _appointmentRepository.ReleaseUnpaidAppointmentsAsync();
        }
    }
}
