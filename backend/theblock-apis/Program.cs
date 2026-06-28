using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using theblock_apis.Commons;
using theblock_apis.Data;
using theblock_apis.Entities;
using theblock_apis.Middlewares;
using theblock_apis.Services;
using theblock_apis.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:7275")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// SQLite - EF Core
var connectionString = builder.Configuration.GetSection("DatabaseConfiguration").GetValue(typeof(string), "ConnectionString")
    ?? "Data Source=Data/theblock.db";
builder.Services.AddDbContext<AppDbContext>(options => options
    .UseSqlite(connectionString.ToString())
    .LogTo(Console.WriteLine)
);

// Database Initialize
builder.Services.Configure<DatabaseConfiguration>(builder.Configuration.GetSection("DatabaseConfiguration"));
builder.Services.AddHostedService<DatabaseInitializer>();

// Auto map
builder.Services.AddAutoMapper(cfg => { }, typeof(MappingProfile));

// Business Services
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IProfilesService, ProfilesService>();
builder.Services.AddScoped<IBiddingService, BiddingService>();

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseExceptionMiddleware();

app.UseAuthorization();

app.MapControllers();

app.Run();
