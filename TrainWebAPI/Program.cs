using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication;
using TrainWeb.Application.Interfaces;
using TrainWeb.Application.Services;
using TrainWeb.Infrastructure.Repositories;
using TrainWeb.Infrastructure.Services;
using TrainWeb.Infrastructure.Services.Momo;
using TrainWebAPI.Middlewares;
using Microsoft.OpenApi.Models;
using FirestoreDbContext = TrainWeb.Infrastructure.Persistence.FirestoreDbContext;

var builder = WebApplication.CreateBuilder(args);

var projectId = builder.Configuration["Firebase:ProjectId"] ?? "gorail-g16";

var serviceAccountPathFromConfig = builder.Configuration["Firebase:ServiceAccountPath"];
var credentialPath = string.IsNullOrWhiteSpace(serviceAccountPathFromConfig)
    ? Path.Combine(builder.Environment.ContentRootPath, "firebase-key.json")
    : Path.IsPathRooted(serviceAccountPathFromConfig)
        ? serviceAccountPathFromConfig
        : Path.Combine(builder.Environment.ContentRootPath, serviceAccountPathFromConfig);

// Validate the credential file early and fail fast with a clear message when missing.
if (!File.Exists(credentialPath))
{
    // Try to discover the file anywhere under the content root to make local dev less brittle
    var discovered = Directory.EnumerateFiles(builder.Environment.ContentRootPath, "firebase-key.json", SearchOption.AllDirectories).FirstOrDefault();
    if (!string.IsNullOrEmpty(discovered) && File.Exists(discovered))
    {
        Console.WriteLine($"Notice: Found firebase-key.json at '{discovered}' and will use it.");
        credentialPath = discovered;
    }
    else
    {
        Console.WriteLine($"ERROR: Firebase service account file not found at '{credentialPath}'.\n" +
                          "Please set 'Firebase:ServiceAccountPath' in configuration or place 'firebase-key.json' in the application content root.");
        throw new FileNotFoundException($"Firebase service account file not found at '{credentialPath}'.", credentialPath);
    }
}

builder.Services.AddSingleton(sp => new FirestoreDbContext(projectId, credentialPath));

// ===== DI: Infrastructure services =====
builder.Services.AddSingleton<BCryptPasswordHasher>();

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

builder.Services.AddHttpClient<MapService>();

// ===== Controllers =====
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

// ===== CORS =====
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

// ===== Firebase Admin Service =====
builder.Services.AddSingleton<FirebaseService>();

// ===== Authentication (Firebase ID Token) =====

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "Firebase";
    options.DefaultChallengeScheme = "Firebase";
})
.AddScheme<AuthenticationSchemeOptions, FirebaseAuthenticationHandler>("Firebase", _ => { });


// ===== Authorization policies (role lowercase: admin/staff/passenger) =====
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
    options.AddPolicy("StaffOrAdmin", policy => policy.RequireRole("staff", "admin"));
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TrainWeb API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Dán Firebase ID Token (chỉ token, Swagger sẽ tự thêm Bearer)."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ===== Swagger =====
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "TrainWeb API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors("AllowAll");

// Auth pipeline
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
