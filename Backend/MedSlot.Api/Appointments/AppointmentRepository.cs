using MedSlot.Api.Appointments.Dtos;
using MedSlot.Api.Data;

namespace MedSlot.Api.Appointments
{
    public class AppointmentRepository: IAppointmentRepository
    {
        private MedSlotDbContext _context;

        public AppointmentRepository(MedSlotDbContext context)
        {
            _context = context;
        }

        public async Task<BookAppointmentResponse> BookAppointmentAsync(BookAppointmentRequest request)
        {
            var response = new BookAppointmentResponse();
            return response;
        }
    }
}
