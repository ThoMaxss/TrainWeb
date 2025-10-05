using Google.Cloud.Firestore;
using System.Text.Json.Serialization;
using TrainWeb.Application.Interfaces;
using TrainWeb.Application.Services;
using TrainWeb.Infrastructure.Persistence;
using TrainWeb.Infrastructure.Repositories;
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
    .AddScoped<ISeatRepository, SeatRepository>();

builder.Services.AddScoped<BookingService>()
    .AddScoped<UserService>()
    .AddScoped<TrainService>()
    .AddScoped<TripService>()
    .AddScoped<SeatService>();

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
