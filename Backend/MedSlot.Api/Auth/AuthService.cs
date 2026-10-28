using System.Security.Authentication;
using System.Security.Claims;
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

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            // Get User
            LoggingUser loggingUser = await _authRepository.GetLoggingUser(request);
            User? user = loggingUser.user;
            string? userType = loggingUser.userType;

            if (user is null)
            {
                throw new AuthenticationException("Invalid UserName or Password");
            }

            // Validate Password
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            bool isPasswordValid = result == PasswordVerificationResult.Success;
            
            if (!isPasswordValid)
            {
                throw new AuthenticationException("Invalid UserName or Password");
            }

            if (loggingUser.isRegistrationCompleted && userType == "Doctor" && loggingUser.doctorId is null)
                throw new AuthenticationException("Account Data is inconsistent - contact support.");

            if (loggingUser.isRegistrationCompleted && userType == "Patient" && loggingUser.patientId is null)
                throw new AuthenticationException("Account Data is inconsistent - contact support.");

            Claim? idClaim = null;

            // add new claim as per user type
            if (loggingUser.patientId != null) idClaim = new Claim("patientId", loggingUser.patientId.ToString());
            if (loggingUser.doctorId != null) idClaim = new Claim("doctorId", loggingUser.doctorId.ToString());
            
            var additionalClaims = idClaim is not null ? new[] { idClaim } : Array.Empty<Claim>();

            var token = _tokenService.GenerateToken(user.Id, userType, additionalClaims);

            return new LoginResponse
            {
                AuthToken = token,
                IsRegistrationCompleted = loggingUser.isRegistrationCompleted
            };
        }
    }
}
