## [1.0.2] - 2025-05-31

- Merge branch 'main' of https://github.com/FullstackCodingGuy/AlphaFeatureToggler
- optimizations

## [1.0.1] - 2025-05-31

- Update AlphaFeatureToggler.csproj
- release version fix
- release-fix1
- nuget fixes2
- nuget changes

# Changelog

## [1.0.0] - 2025-05-31

### 🚀 Features
- **Enterprise-Grade Feature Toggling**  
  Wrapper around Microsoft.FeatureManagement with advanced toggling, kill switches, and environment targeting.
- **Kill Switch Support**  
  Instantly disable features across environments for safety and incident response.
- **Environment Targeting**  
  Enable/disable features per environment (dev, staging, prod, etc.).
- **API Integration**  
  Extensible API integration points for external flag management and automation.
- **Audit Logging**  
  Batched, offloaded audit logging for compliance and traceability.
- **Access Control**  
  Role/user-based access control for feature flags.
- **Change Propagation**  
  Real-time or near-real-time flag change propagation and cache invalidation.
- **Promotion Workflow**  
  Safe promotion of feature flag settings between environments.
- **Documentation**  
  Setup and usage documentation included (`SETUP_API.md`).
- **Unit Testing**  
  Comprehensive unit tests for toggling, kill switch, and caching scenarios.
- **NuGet Packaging**  
  Ready for redistribution as a NuGet package.
- **Console Demo App**  
  Realistic enterprise use cases demonstrated in a .NET 9 console app.
- **Dependency Injection Extension**  
  Simple DI setup via `AddAlphaFeatureToggler` extension method.

### 🛠 Improvements
- In-memory/demo implementations for all extensibility points.
- Configurable, thread-safe caching for feature flag results.
- Batching audit logger using `ConcurrentQueue`.
- All build errors fixed and tests passing.

### 📦 Distribution
- NuGet package is built and attached to GitHub Releases via CI workflow.
- Build, test, and pack status badge included in `README.md`.
- **License:** Apache License 2.0 (see LICENSE file and NuGet metadata).
