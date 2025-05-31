using AlphaFeatureToggler.Core;
using AlphaFeatureToggler.Integration;
using System.Diagnostics;

namespace AlphaFeatureToggler.Tests
{
    public class FeatureToggleServicePerformanceTests
    {
        [Theory]
        [InlineData(false)]
        [InlineData(true)]
        public async Task IsEnabledAsync_Performance_WithAndWithoutCaching(bool enableCaching)
        {
            var featureManager = new FastFakeFeatureManager(true);
            var service = new FeatureToggleService(
                featureManager,
                new InMemoryFeatureAuditLogger(),
                new InMemoryFeatureChangePropagator(),
                new InMemoryFeaturePromotionWorkflow(),
                new InMemoryFeatureApiIntegration(),
                Microsoft.Extensions.Options.Options.Create(new FeatureToggleServiceOptions
                {
                    Environment = FeatureEnvironment.Production,
                    EnableCaching = enableCaching,
                    FeatureCacheSeconds = 60
                })
            );
            var sw = Stopwatch.StartNew();
            for (int i = 0; i < 1000; i++)
                await service.IsEnabledAsync("PerfFeature");
            sw.Stop();
            // Output for manual inspection
            System.Console.WriteLine($"Caching: {enableCaching}, Time: {sw.ElapsedMilliseconds}ms");
            Assert.True(sw.ElapsedMilliseconds < (enableCaching ? 100 : 2000)); // Caching should be much faster
        }

        private class FastFakeFeatureManager : Microsoft.FeatureManagement.IFeatureManager
        {
            private readonly bool _isEnabled;
            public FastFakeFeatureManager(bool isEnabled) => _isEnabled = isEnabled;
            public Task<bool> IsEnabledAsync(string feature) => Task.FromResult(_isEnabled);
            public IAsyncEnumerable<string> GetFeatureNamesAsync() => GetNames();
            public Task<bool> IsEnabledAsync<TContext>(string feature, TContext context) => Task.FromResult(_isEnabled);
            private async IAsyncEnumerable<string> GetNames() { yield break; }
        }
    }

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

        [Fact]
        public async Task ClearFeatureCache_PropagatesChange()
        {
            var featureManager = new FakeFeatureManager(true);
            var service = new FeatureToggleService(
                featureManager,
                new InMemoryFeatureAuditLogger(),
                new InMemoryFeatureChangePropagator(),
                new InMemoryFeaturePromotionWorkflow(),
                new InMemoryFeatureApiIntegration(),
                Microsoft.Extensions.Options.Options.Create(new FeatureToggleServiceOptions
                {
                    Environment = FeatureEnvironment.Production,
                    EnableCaching = true,
                    FeatureCacheSeconds = 60
                })
            );
            // Prime cache with true
            Assert.True(await service.IsEnabledAsync("CachePropTest"));
            // Simulate feature flag change
            featureManager.SetEnabled(false);
            // Should still be true due to cache
            Assert.True(await service.IsEnabledAsync("CachePropTest"));
            // Clear cache and check again
            service.ClearFeatureCache();
            Assert.False(await service.IsEnabledAsync("CachePropTest"));
        }

        public class FakeFeatureManager : Microsoft.FeatureManagement.IFeatureManager
        {
            private bool _isEnabled;
            public FakeFeatureManager(bool isEnabled) => _isEnabled = isEnabled;
            public void SetEnabled(bool enabled) => _isEnabled = enabled;
            public Task<bool> IsEnabledAsync(string feature) => Task.FromResult(_isEnabled);
            public IAsyncEnumerable<string> GetFeatureNamesAsync() => GetNames();
            public Task<bool> IsEnabledAsync<TContext>(string feature, TContext context) => Task.FromResult(_isEnabled);
            private async IAsyncEnumerable<string> GetNames() { yield break; }
        }
    }
}
