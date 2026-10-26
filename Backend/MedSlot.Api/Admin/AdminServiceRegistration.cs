namespace MedSlot.Api.Admin
{
    public static class AdminServiceRegistration
    {
        public static IServiceCollection AddAdminServices(this IServiceCollection services)
        {
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<IAdminRepository, AdminRepository>();

            return services;
        }
    }
}
