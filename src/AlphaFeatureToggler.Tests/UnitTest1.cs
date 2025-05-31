using AlphaFeatureToggler;
using AlphaFeatureToggler.Core;
using AlphaFeatureToggler.Integration;
using System.Collections.Generic;

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
                new InMemoryFeatureApiIntegration()
            );

            // Act
            var result = await service.IsEnabledAsync("TestFeature", FeatureEnvironment.Development);

            // Assert
            Assert.False(result);
        }
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
