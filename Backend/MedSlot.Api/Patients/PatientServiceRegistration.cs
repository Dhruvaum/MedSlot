namespace MedSlot.Api.Patients
{
    public static class PatientServiceRegistration
    {
        public static IServiceCollection AddPatientServices(this IServiceCollection services)
        {
            services.AddScoped<IPatientRepository, PatientRepository>();
            services.AddScoped<IPatientService, PatientService>();

            return services;
        }
        
    }
}
