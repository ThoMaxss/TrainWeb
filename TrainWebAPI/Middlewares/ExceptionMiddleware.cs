using TrainWeb.Domain.Exceptions;

namespace TrainWebAPI.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
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
                Console.WriteLine("ERROR: " + ex.Message);
                await context.Response.WriteAsJsonAsync(new
                {
                    status = 500,
                    error = "Internal server error",
                });
            }
        }
    }
}
