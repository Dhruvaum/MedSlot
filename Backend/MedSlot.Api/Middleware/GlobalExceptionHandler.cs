using Microsoft.AspNetCore.Diagnostics;
using System.Security.Authentication;

namespace MedSlot.Api.Middleware
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken
        )
        {
            _logger.LogError(exception, "Unhandled exception occured");

            var (statusCode, message) = exception switch
            {
                AuthenticationException => (StatusCodes.Status401Unauthorized, exception.Message),
                InvalidOperationException => (StatusCodes.Status409Conflict, exception.Message),
                UnauthorizedAccessException => (StatusCodes.Status403Forbidden, exception.Message),
                _ => (StatusCodes.Status500InternalServerError, "An unexpected error occured."),
            };

            httpContext.Response.StatusCode = statusCode;
            await httpContext.Response.WriteAsJsonAsync(new { error = message }, cancellationToken);

            return true;
        }
    }
}
