using AlphaFeatureToggler;
using AlphaFeatureToggler.Core;
using AlphaFeatureToggler.Integration;
using Xunit;
using System.Threading.Tasks;

namespace AlphaFeatureToggler.Tests
{
    public class FeatureToggleServiceTests
    {
        [Fact]
        public async Task IsEnabledAsync_ReturnsFalse_WhenFeatureIsNotEnabled()
        {
            // Arrange
            var featureManager = new FakeFeatureManager(false);
            var service = new FeatureToggleService(
                featureManager,
                new InMemoryFeatureAuditLogger(),
                new InMemoryFeatureChangePropagator(),
                new InMemoryFeaturePromotionWorkflow(),
                new InMemoryFeatureApiIntegration(),
                Microsoft.Extensions.Options.Options.Create(new FeatureToggleServiceOptions { Environment = FeatureEnvironment.Development })
            );

            // Act
            var result = await service.IsEnabledAsync("TestFeature");

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task IsEnabledAsync_ReturnsTrue_WhenFeatureIsEnabled_AndNoKillSwitch()
        {
            // Arrange
            var featureManager = new FakeFeatureManager(true);
            var service = new FeatureToggleService(
                featureManager,
                new InMemoryFeatureAuditLogger(),
                new InMemoryFeatureChangePropagator(),
                new InMemoryFeaturePromotionWorkflow(),
                new InMemoryFeatureApiIntegration(),
                Microsoft.Extensions.Options.Options.Create(new FeatureToggleServiceOptions { Environment = FeatureEnvironment.Production })
            );

            // Act
            var result = await service.IsEnabledAsync("TestFeature");

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task IsEnabledAsync_ReturnsFalse_WhenKillSwitchActive()
        {
            // Arrange
            var featureManager = new FakeFeatureManager(true);
            var service = new FeatureToggleService(
                featureManager,
                new InMemoryFeatureAuditLogger(),
                new InMemoryFeatureChangePropagator(),
                new InMemoryFeaturePromotionWorkflow(),
                new InMemoryFeatureApiIntegration(),
                Microsoft.Extensions.Options.Options.Create(new FeatureToggleServiceOptions { Environment = FeatureEnvironment.Staging })
            );
            await service.ActivateKillSwitchAsync("TestFeature", FeatureEnvironment.Staging, "reason", "user");

            // Act
            var result = await service.IsEnabledAsync("TestFeature");

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task KillSwitch_ActivateAndDeactivate_WorksCorrectly()
        {
            // Arrange
            var featureManager = new FakeFeatureManager(true);
            var service = new FeatureToggleService(
                featureManager,
                new InMemoryFeatureAuditLogger(),
                new InMemoryFeatureChangePropagator(),
                new InMemoryFeaturePromotionWorkflow(),
                new InMemoryFeatureApiIntegration(),
                Microsoft.Extensions.Options.Options.Create(new FeatureToggleServiceOptions { Environment = FeatureEnvironment.Testing })
            );
            await service.ActivateKillSwitchAsync("TestFeature", FeatureEnvironment.Testing, "reason", "user");

            // Act & Assert
            Assert.True(await service.IsKillSwitchActiveAsync("TestFeature"));
            await service.DeactivateKillSwitchAsync("TestFeature", FeatureEnvironment.Testing, "user");
            Assert.False(await service.IsKillSwitchActiveAsync("TestFeature"));
        }

        // Fake implementation for testing
        public class FakeFeatureManager : Microsoft.FeatureManagement.IFeatureManager
        {
            private readonly bool _isEnabled;
            public FakeFeatureManager(bool isEnabled) => _isEnabled = isEnabled;
            public Task<bool> IsEnabledAsync(string feature) => Task.FromResult(_isEnabled);
            public IAsyncEnumerable<string> GetFeatureNamesAsync() => GetNames();
            public Task<bool> IsEnabledAsync<TContext>(string feature, TContext context) => Task.FromResult(_isEnabled);
            private async IAsyncEnumerable<string> GetNames()
            {
                yield break;
            }
        }
    }
}
