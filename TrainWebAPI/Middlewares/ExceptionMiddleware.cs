using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using TrainWeb.Domain.Exceptions;

namespace TrainWebAPI.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (HttpResponseException ex)
            {
                context.Response.StatusCode = ex.StatusCode;
                context.Response.ContentType = "application/json";

                var result = new
                {
                    status = ex.StatusCode,
                    error = ex.Message
                };

                await context.Response.WriteAsJsonAsync(result);
            }
            catch (Exception ex)
            {
                // Catch all unhandled exceptions
                context.Response.StatusCode = StatusCodeConstants.InternalServerError;
                context.Response.ContentType = "application/json";
                _logger.LogError(ex, "Unhandled exception");

                if (_env.IsDevelopment())
                {
                    // In development, include the exception message to aid debugging
                    await context.Response.WriteAsJsonAsync(new
                    {
                        status = 500,
                        error = ex.Message,
                        detail = ex.StackTrace
                    });
                }
                else
                {
                    await context.Response.WriteAsJsonAsync(new
                    {
                        status = 500,
                        error = "Internal server error",
                    });
                }
            }
        }
    }
}
