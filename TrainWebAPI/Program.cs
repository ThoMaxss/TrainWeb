using Google.Cloud.Firestore;
using TrainWeb.Infrastructure.Persistence;
using TrainWeb.Infrastructure.Repositories;
using FirestoreDbContext = TrainWeb.Infrastructure.Persistence.FirestoreDbContext;

var builder = WebApplication.CreateBuilder(args);

var projectId = "trainweb-g16";
var credentialPath = Path.Combine(builder.Environment.ContentRootPath, "firebase-key.json");

builder.Services.AddSingleton<FirestoreDbContext>(sp =>
    new FirestoreDbContext(projectId, credentialPath));

builder.Services.AddScoped<BookingRepository>();
builder.Services.AddScoped<UserRepository>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
