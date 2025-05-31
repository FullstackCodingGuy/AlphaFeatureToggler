# AlphaFeatureToggler Setup & API Guide

## Quick Start

1. **Install the NuGet package**
   - Add `AlphaFeatureToggler` to your project via NuGet.

2. **Add to Dependency Injection**
   - In your `Program.cs` or startup:
     ```csharp
     services.AddAlphaFeatureToggler(opt => {
         opt.Environment = FeatureEnvironment.Development; // or Staging/Production
         opt.EnableCaching = true; // optional, default is false
         opt.FeatureCacheSeconds = 10; // optional, cache duration in seconds
     });
     ```
   - This registers all required services, in-memory/demo implementations, and the DI extension method. No manual registrations needed.

3. **Get the Feature Toggle Service**
   - Inject or resolve `IFeatureToggleService`:
     ```csharp
     var toggler = provider.GetRequiredService<IFeatureToggleService>();
     ```

4. **Set and Check Feature Flags**
   - Use the in-memory feature manager for demo/testing:
     ```csharp
     var featureManager = provider.GetRequiredService<Microsoft.FeatureManagement.IFeatureManager>();
     featureManager.SetFeature("MyFeature", true);
     bool enabled = await toggler.IsEnabledAsync("MyFeature");
     ```

5. **Kill Switch, Audit, and Propagation**
   - Use `ActivateKillSwitchAsync`, `DeactivateKillSwitchAsync`, and `ClearFeatureCache` for enterprise scenarios.

---

## Features & Integrations

- **Feature Toggling**: Per environment, user, or role.
- **Kill Switch**: Instantly disable features for safety.
- **Audit Logging**: Batched, offloaded, and extensible.
- **Change Propagation**: Real-time cache invalidation.
- **Promotion Workflow**: Safe flag promotion between environments.
- **API Integration**: Extensible points for external systems.
- **Access Control**: Role/user-based access.
- **Caching**: Optional, thread-safe, and configurable.
- **In-Memory Implementations**: For demo/testing, easily swappable for production.

---

## Extending for Production

- Replace in-memory implementations with your own (e.g., Redis, SQL, distributed cache, external audit loggers).
- Implement interfaces: `IFeatureAuditLogger`, `IFeatureChangePropagator`, `IFeaturePromotionWorkflow`, `IFeatureApiIntegration`.
- Register your implementations before calling `AddAlphaFeatureToggler`.

---

## Example: Console App Integration

See [`src/AlphaFeatureToggler.ConsoleDemo/Program.cs`](src/AlphaFeatureToggler.ConsoleDemo/Program.cs) for a complete, realistic usage example demonstrating all enterprise scenarios:

```csharp
var services = new ServiceCollection();
services.AddAlphaFeatureToggler(opt => {
    opt.Environment = FeatureEnvironment.Production;
    opt.EnableCaching = true;
    opt.FeatureCacheSeconds = 30;
});
var provider = services.BuildServiceProvider();
var toggler = provider.GetRequiredService<IFeatureToggleService>();
var featureManager = provider.GetRequiredService<Microsoft.FeatureManagement.IFeatureManager>();

featureManager.SetFeature("AdvancedReporting", true);
bool canAccess = await toggler.IsEnabledAsync("AdvancedReporting");
```

> **See the full demo in [`src/AlphaFeatureToggler.ConsoleDemo/Program.cs`](src/AlphaFeatureToggler.ConsoleDemo/Program.cs) for advanced scenarios: user/role access, enable/disable, kill switch, caching, change propagation, and audit logging.

---

## Performance & Best Practices

- Enable caching for high-throughput scenarios.
- Use `ClearFeatureCache` after flag changes for instant propagation.
- Use the audit log for compliance and debugging.
- For distributed scenarios, implement a distributed cache and change propagator.

---

## CI/CD & NuGet

- The package is built, tested, and published via GitHub Actions.
- See the status badge in `README.md`.
- Release notes and changelog are maintained in `CHANGELOG.md`.

---

For more, see the source code and integration tests for advanced usage and extension points.
