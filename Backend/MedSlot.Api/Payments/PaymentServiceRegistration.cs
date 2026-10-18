namespace MedSlot.Api.Payments
{
    public static class PaymentServiceRegistration
    {
        public static IServiceCollection AddPaymentServices(this IServiceCollection services)
        {
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();

            return services;
        }
    }
}
