using MedSlot.Api.Appointments.TimeSlots;

namespace MedSlot.Api.Appointments
{
    public static class AppointmentsServiceRegistration
    {
        public static IServiceCollection AddAppointmentServices(this IServiceCollection services)
        {
            services.AddScoped<ITimeSlotService, TimeSlotService>();
            services.AddScoped<ITimeSlotRepository, TimeSlotRepository>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<IAppointmentRepository, AppointmentRepository>();

            return services;
        }
    }
}
