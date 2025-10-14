using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using TrainWeb.Application.Interfaces;
using TrainWeb.Application.Services;
using TrainWeb.Infrastructure.Persistence;
using TrainWeb.Infrastructure.Repositories;
using TrainWeb.Infrastructure.Services;
using FirestoreDbContext = TrainWeb.Infrastructure.Persistence.FirestoreDbContext;

var builder = WebApplication.CreateBuilder(args);

var projectId = "trainweb-g16";
var credentialPath = Path.Combine(builder.Environment.ContentRootPath, "firebase-key.json");

builder.Services.AddSingleton<FirestoreDbContext>(sp =>
    new FirestoreDbContext(projectId, credentialPath));

builder.Services.AddSingleton<BCryptPasswordHasher>();

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


//AuthService
builder.Services.AddSingleton<AuthService>();

//Cấu hình Authentication & Authorization
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT key is missing from configuration.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            )
        };
    });


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("StaffOrAdmin", policy => policy.RequireRole("Staff", "Admin"));
});



var app = builder.Build();

//Middleware 
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "TrainWeb API v1");
        options.RoutePrefix = "swagger";
    });
    app.UseDeveloperExceptionPage(); 
}


app.MapControllers();
app.Run();
