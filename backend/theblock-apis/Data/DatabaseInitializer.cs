using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using theblock_apis.Entities;

namespace theblock_apis.Data
{
    public class DatabaseInitializer : IHostedService
    {
        private readonly ILogger<DatabaseInitializer> _logger;
        private readonly IServiceProvider _serviceProvider;

        public DatabaseInitializer(IServiceProvider serviceProvider, ILogger<DatabaseInitializer> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Initializing SQLite database...");

            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            try
            {
                await dbContext.Database.EnsureCreatedAsync();
                _logger.LogInformation("Database created successfully.");

                // Optional seed
                if (!await dbContext.VehicleEntities.AnyAsync(cancellationToken))
                {
                    var jsonFilePath = Path.Combine(AppContext.BaseDirectory, "Data", "vehicles.json");
                    if (!File.Exists(jsonFilePath)) throw new FileNotFoundException($"JSON file not found: {jsonFilePath}");
                    var jsonString = await File.ReadAllTextAsync(jsonFilePath);
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        ReadCommentHandling = JsonCommentHandling.Skip,
                        AllowTrailingCommas = true
                    };
                    var data = JsonSerializer.Deserialize<List<VehicleEntity>>(jsonString, options)
                               ?? throw new InvalidOperationException("Failed to deserialize JSON");
                    await dbContext.VehicleEntities.AddRangeAsync(data);
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database initialization failed.");
                throw;
            }

            _logger.LogInformation("SQLite database initialized successfully.");
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
