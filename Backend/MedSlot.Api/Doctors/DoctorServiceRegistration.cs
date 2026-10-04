namespace MedSlot.Api.Doctors
{
    public static class DoctorServiceRegistration
    {
        public static IServiceCollection AddDoctorServices(this IServiceCollection services)
        {
            services.AddScoped<IDoctorService, DoctorService>();
            services.AddScoped<IDoctorRepository, DoctorRepository>();

            return services;
        }
    }
}
