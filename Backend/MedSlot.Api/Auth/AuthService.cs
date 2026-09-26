using MedSlot.Api.Auth.Dtos;
using MedSlot.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace MedSlot.Api.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ITokenService _tokenService;

        public AuthService(
            IAuthRepository authRepository,
            IPasswordHasher<User> passwordHasher,
            ITokenService tokenService
        )
        {
            _authRepository = authRepository;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
        }

        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
        {
            var isTaken = await _authRepository.IsUserNameOrEmailTakenAsync(request.UserName, request.Email);
            if (isTaken)
            {
                throw new InvalidOperationException("Username or email is already taken.");
            }

            var userTypeId = await _authRepository.GetUserTypeIdByNameAsync(request.UserType);

            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                UserTypeId = userTypeId,
                UserName = request.UserName,
                Email = request.Email,
                IsRegistrationCompleted = false
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);
            await _authRepository.AddUserAsync(user);
            await _authRepository.SaveChangesAsync();

            var token = _tokenService.GenerateToken(userId, request.UserType);

            return new RegisterResponse
            {
                AuthToken = token,
                Role = request.UserType,
                IsRegistrationCompleted = false,
            };
        }
    }
}
