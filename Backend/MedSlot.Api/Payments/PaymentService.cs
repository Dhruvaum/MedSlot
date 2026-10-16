using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Models;
using MedSlot.Api.Payments.Dtos;

namespace MedSlot.Api.Payments
{
    public class PaymentService: IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        public PaymentService(IPaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }

        public async Task<InitiatePaymentResponse> InitiatePaymentAsync(BookAppointmentResponse appointment)
        {
            var appointmentId = appointment.AppointmentId;

            var doctor = await _paymentRepository.GetDoctorByAppoinmentIdAsync(appointmentId);

            if(doctor.ConsultDurationMinutes == null || doctor.ConsultDurationMinutes <= 0)
            {
                throw new InvalidOperationException("Consultation Duration should be more than 0 minutes");
            }
            if (doctor.ConsultationFee == null || doctor.ConsultationFee <= 0) throw new InvalidOperationException("Cannot proceed for checkout. Consultation Fee is not known for this doctor");

            // Create Payment Row

            await _paymentRepository.CreatePaymentRowAsync(appointment, doctor);
            return new InitiatePaymentResponse();
            
        }
    }
}
