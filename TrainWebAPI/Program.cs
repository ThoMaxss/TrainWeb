using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using TrainWeb.Application.Interfaces;
using TrainWeb.Application.Services;
using TrainWeb.Infrastructure.Repositories;
using TrainWeb.Infrastructure.Services;
using TrainWeb.Infrastructure.Services.Momo;
using TrainWebAPI.Middlewares;
using FirestoreDbContext = TrainWeb.Infrastructure.Persistence.FirestoreDbContext;

var builder = WebApplication.CreateBuilder(args);

var projectId = "trainweb-g16";
var credentialPath = Path.Combine(builder.Environment.ContentRootPath, "firebase-key.json");

builder.Services.AddSingleton<FirestoreDbContext>(sp =>
    new FirestoreDbContext(projectId, credentialPath));

builder.Services.AddScoped<IBookingRepository, BookingRepository>()
    .AddScoped<IUserRepository, UserRepository>()
    .AddScoped<ITrainRepository, TrainRepository>()
    .AddScoped<ITripRepository, TripRepository>()
    .AddScoped<ISeatRepository, SeatRepository>()
    .AddScoped<IPaymentRepository, PaymentRepository>()
    .AddScoped<ITicketRepository, TicketRepository>()
    .AddScoped<ITicketTypeRepository, TicketTypeRepository>();

builder.Services.AddScoped<BookingService>()
    .AddScoped<UserService>()
    .AddScoped<TrainService>()
    .AddScoped<TripService>()
    .AddScoped<SeatService>()
    .AddScoped<MomoService>()
    .AddScoped<AuthService>()
    .AddScoped<PaymentService>()
    .AddScoped<TicketService>()
    .AddScoped<TicketTypeService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Enable CORS
app.UseCors("AllowAll");
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
