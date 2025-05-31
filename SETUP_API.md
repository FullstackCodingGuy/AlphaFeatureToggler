# AlphaFeatureToggler Setup Guide for API Solutions

This guide explains how to integrate the AlphaFeatureToggler library into a new .NET API solution, including code snippets, demo data, caching options, and how to leverage audit logging for feature flag changes.

---

## 1. Install the NuGet Package

Add the AlphaFeatureToggler library to your API project:

```bash
# Replace <version> with the latest version if published
 dotnet add package AlphaFeatureToggler
```

If using a local project reference:

```bash
dotnet add reference ../AlphaFeatureToggler/AlphaFeatureToggler.csproj
```

---

## 2. Register Services in Dependency Injection

In your `Program.cs` or `Startup.cs`, register the required services:

```csharp
using AlphaFeatureToggler.Core;
using AlphaFeatureToggler.Integration;
using Microsoft.FeatureManagement;

var builder = WebApplication.CreateBuilder(args);

// Add Microsoft.FeatureManagement
builder.Services.AddFeatureManagement();

// Register AlphaFeatureToggler services
// builder.Services.AddSingleton<IFeatureAuditLogger, InMemoryFeatureAuditLogger>();
builder.Services.AddSingleton<IFeatureAuditLogger>(_ => new BatchingFeatureAuditLogger(batchSize: 20, intervalMs: 2000));
builder.Services.AddSingleton<IFeatureChangePropagator, InMemoryFeatureChangePropagator>();
builder.Services.AddSingleton<IFeaturePromotionWorkflow, InMemoryFeaturePromotionWorkflow>();
builder.Services.AddSingleton<IFeatureApiIntegration, InMemoryFeatureApiIntegration>();
builder.Services.AddSingleton<IFeatureToggleService, FeatureToggleService>();

// Register options for environment and caching (optional, defaults shown below)
builder.Services.Configure<FeatureToggleServiceOptions>(options =>
{
    options.Environment = builder.Environment.IsDevelopment()
        ? FeatureEnvironment.Development
        : FeatureEnvironment.Production;
    options.EnableCaching = true; // Set to true to enable caching
    options.FeatureCacheSeconds = 60; // Set cache duration in seconds
});

var app = builder.Build();
// ...existing code...
app.Run();
```

---

## 3. Add Feature Flags to Configuration

Add demo feature flags to your `appsettings.json`:

```json
{
  "FeatureManagement": {
    "DemoFeature": true,
    "BetaFeature": false
  }
}
```

---

## 4. Use the Feature Toggle Service in Controllers

Example controller usage:

```csharp
using AlphaFeatureToggler.Core;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class DemoController : ControllerBase
{
    private readonly IFeatureToggleService _featureToggleService;

    public DemoController(IFeatureToggleService featureToggleService)
    {
        _featureToggleService = featureToggleService;
    }

    [HttpGet("demo")]
    public async Task<IActionResult> GetDemo()
    {
        bool enabled = await _featureToggleService.IsEnabledAsync("DemoFeature"); // Uses default environment
        if (!enabled)
            return Forbid();
        return Ok("Demo feature is enabled!");
    }
}
```

---

## 5. Leveraging Audit Logging

The `IFeatureAuditLogger` interface allows you to capture and persist audit events for feature flag changes, such as toggling a feature or activating a kill switch. By default, the sample uses `InMemoryFeatureAuditLogger`, but you can implement your own logger to store audit logs in a database, file, or external system.

### Example: Custom Audit Logger

```csharp
using AlphaFeatureToggler.Core;
using System.Threading.Tasks;
using System.Diagnostics;

public class ConsoleAuditLogger : IFeatureAuditLogger
{
    public Task LogAsync(FeatureAuditLog logEntry)
    {
        Debug.WriteLine($"[AUDIT] {logEntry.Timestamp:u} | {logEntry.Environment} | {logEntry.FeatureName} | {logEntry.Action} | {logEntry.UserId} | {logEntry.Details}");
        return Task.CompletedTask;
    }
}
```

Register your custom logger in `Program.cs`:

```csharp
builder.Services.AddSingleton<IFeatureAuditLogger, ConsoleAuditLogger>();
```

Whenever a feature is toggled or a kill switch is activated/deactivated, the logger will be called automatically by the `FeatureToggleService`:

```csharp
await _auditLogger.LogAsync(new FeatureAuditLog
{
    FeatureName = featureName,
    Environment = environment,
    Action = "KillSwitchActivated",
    UserId = userId,
    Details = reason,
    Timestamp = System.DateTime.UtcNow
});
```

You can extend this to log to a database, send notifications, or integrate with monitoring tools.

---

## 6. Caching Feature Flag Results

- **How to enable caching:**
  - Set `EnableCaching = true` in `FeatureToggleServiceOptions` (see DI setup above).
- **How to configure cache duration:**
  - Set `FeatureCacheSeconds` in `FeatureToggleServiceOptions`.
- **How to clear/propagate cache changes:**
  - Call `ClearFeatureCache()` on the `FeatureToggleService` instance after a configuration or flag change to invalidate the cache.

---

## 7. Demo Data for Testing

- **Feature Flags:**
  - `DemoFeature`: Enabled
  - `BetaFeature`: Disabled
- **Environments:**
  - `Development`, `Testing`, `Staging`, `Production`
- **Audit Logging:**
  - In-memory logger logs actions (extend for persistent storage)

---

## 8. Extending

Implement your own versions of the interfaces in `AlphaFeatureToggler.Core` for production scenarios (e.g., database audit logging, distributed change propagation).

---

## 9. Running Unit Tests

If you want to run the included tests:

```bash
dotnet test ../AlphaFeatureToggler.Tests/AlphaFeatureToggler.Tests.csproj
```

---

## 10. Performance Testing: Caching vs. No Caching

The library includes performance tests to compare feature flag reads with and without caching. See `FeatureToggleServicePerformanceTests` in the test project for details.

---

## 11. More Information

See the main `README.md` for API reference and advanced scenarios.
