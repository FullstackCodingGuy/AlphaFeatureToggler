using AlphaFeatureToggler.Core;
using AlphaFeatureToggler.Integration;
using System.Diagnostics;
using Moq;

namespace AlphaFeatureToggler.Tests
{
    public class FeatureToggleServicePerformanceTests
    {
        [Theory]
        [InlineData(false)]
        [InlineData(true)]
        public async Task IsEnabledAsync_Performance_WithAndWithoutCaching(bool enableCaching)
        {
            var featureManagerMock = new Mock<Microsoft.FeatureManagement.IFeatureManager>();
            featureManagerMock.Setup(m => m.IsEnabledAsync(It.IsAny<string>())).ReturnsAsync(true);
            featureManagerMock.Setup(m => m.IsEnabledAsync<object>(It.IsAny<string>(), It.IsAny<object>())).ReturnsAsync(true);
            featureManagerMock.Setup(m => m.GetFeatureNamesAsync()).Returns(GetEmptyNames());

            var service = new FeatureToggleService(
                featureManagerMock.Object,
                Mock.Of<IFeatureAuditLogger>(),
                Mock.Of<IFeatureChangePropagator>(),
                Mock.Of<IFeaturePromotionWorkflow>(),
                Mock.Of<IFeatureApiIntegration>(),
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

        private static async IAsyncEnumerable<string> GetEmptyNames() { await Task.Yield(); yield break; }
    }

    public class FeatureToggleServiceTests
    {
        [Fact]
        public async Task IsEnabledAsync_ReturnsFalse_WhenFeatureIsNotEnabled()
        {
            var featureManagerMock = new Mock<Microsoft.FeatureManagement.IFeatureManager>();
            featureManagerMock.Setup(m => m.IsEnabledAsync(It.IsAny<string>())).ReturnsAsync(false);
            featureManagerMock.Setup(m => m.IsEnabledAsync<object>(It.IsAny<string>(), It.IsAny<object>())).ReturnsAsync(false);
            featureManagerMock.Setup(m => m.GetFeatureNamesAsync()).Returns(GetEmptyNames());

            var service = new FeatureToggleService(
                featureManagerMock.Object,
                Mock.Of<IFeatureAuditLogger>(),
                Mock.Of<IFeatureChangePropagator>(),
                Mock.Of<IFeaturePromotionWorkflow>(),
                Mock.Of<IFeatureApiIntegration>(),
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
            var featureManagerMock = new Mock<Microsoft.FeatureManagement.IFeatureManager>();
            featureManagerMock.Setup(m => m.IsEnabledAsync(It.IsAny<string>())).ReturnsAsync(true);
            featureManagerMock.Setup(m => m.IsEnabledAsync<object>(It.IsAny<string>(), It.IsAny<object>())).ReturnsAsync(true);
            featureManagerMock.Setup(m => m.GetFeatureNamesAsync()).Returns(GetEmptyNames());

            var service = new FeatureToggleService(
                featureManagerMock.Object,
                Mock.Of<IFeatureAuditLogger>(),
                Mock.Of<IFeatureChangePropagator>(),
                Mock.Of<IFeaturePromotionWorkflow>(),
                Mock.Of<IFeatureApiIntegration>(),
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
            var featureManagerMock = new Mock<Microsoft.FeatureManagement.IFeatureManager>();
            featureManagerMock.Setup(m => m.IsEnabledAsync(It.IsAny<string>())).ReturnsAsync(true);
            featureManagerMock.Setup(m => m.IsEnabledAsync<object>(It.IsAny<string>(), It.IsAny<object>())).ReturnsAsync(true);
            featureManagerMock.Setup(m => m.GetFeatureNamesAsync()).Returns(GetEmptyNames());

            var service = new FeatureToggleService(
                featureManagerMock.Object,
                Mock.Of<IFeatureAuditLogger>(),
                Mock.Of<IFeatureChangePropagator>(),
                Mock.Of<IFeaturePromotionWorkflow>(),
                Mock.Of<IFeatureApiIntegration>(),
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
            var featureManagerMock = new Mock<Microsoft.FeatureManagement.IFeatureManager>();
            featureManagerMock.Setup(m => m.IsEnabledAsync(It.IsAny<string>())).ReturnsAsync(true);
            featureManagerMock.Setup(m => m.IsEnabledAsync<object>(It.IsAny<string>(), It.IsAny<object>())).ReturnsAsync(true);
            featureManagerMock.Setup(m => m.GetFeatureNamesAsync()).Returns(GetEmptyNames());

            var service = new FeatureToggleService(
                featureManagerMock.Object,
                Mock.Of<IFeatureAuditLogger>(),
                Mock.Of<IFeatureChangePropagator>(),
                Mock.Of<IFeaturePromotionWorkflow>(),
                Mock.Of<IFeatureApiIntegration>(),
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
            var featureManagerMock = new Mock<Microsoft.FeatureManagement.IFeatureManager>();
            var enabled = true;
            featureManagerMock.Setup(m => m.IsEnabledAsync(It.IsAny<string>())).ReturnsAsync(() => enabled);
            featureManagerMock.Setup(m => m.IsEnabledAsync<object>(It.IsAny<string>(), It.IsAny<object>())).ReturnsAsync(() => enabled);
            featureManagerMock.Setup(m => m.GetFeatureNamesAsync()).Returns(GetEmptyNames());

            var service = new FeatureToggleService(
                featureManagerMock.Object,
                Mock.Of<IFeatureAuditLogger>(),
                Mock.Of<IFeatureChangePropagator>(),
                Mock.Of<IFeaturePromotionWorkflow>(),
                Mock.Of<IFeatureApiIntegration>(),
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
            enabled = false;
            // Should still be true due to cache
            Assert.True(await service.IsEnabledAsync("CachePropTest"));
            // Clear cache and check again
            service.ClearFeatureCache();
            Assert.False(await service.IsEnabledAsync("CachePropTest"));
        }

        private static async IAsyncEnumerable<string> GetEmptyNames() { await Task.Yield(); yield break; }
    }
}
