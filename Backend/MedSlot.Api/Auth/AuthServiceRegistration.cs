using MedSlot.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace MedSlot.Api.Auth
{
    public static class AuthServiceRegistration
    {
        public static IServiceCollection AddAuthServices(this IServiceCollection services)
        {
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}
