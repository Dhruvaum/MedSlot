namespace MedSlot.Api.MedslotSupport
{
    public static class SupportServiceRegistration
    {
        public static IServiceCollection AddMedSlotSupportServices(this IServiceCollection services)
        {
            services.AddScoped<ISupportService, SupportService>();
            services.AddScoped<ISupportRepository, SupportRepository>();

            return services;
        }
    }
}
