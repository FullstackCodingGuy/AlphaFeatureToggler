using AlphaFeatureToggler.Core;
using AlphaFeatureToggler.Integration;
using Microsoft.Extensions.Options;
using Moq;

namespace AlphaFeatureToggler.Tests
{
    public class FeatureAttributesTests
    {
        private readonly InMemoryFeatureManager _featureManager;
        private readonly FeatureToggleService _service;

        public FeatureAttributesTests()
        {
            _featureManager = new InMemoryFeatureManager();
            _service = new FeatureToggleService(
                _featureManager,
                Mock.Of<IFeatureAuditLogger>(),
                Mock.Of<IFeatureChangePropagator>(),
                Mock.Of<IFeaturePromotionWorkflow>(),
                Mock.Of<IFeatureApiIntegration>(),
                Options.Create(new FeatureToggleServiceOptions { Environment = FeatureEnvironment.Development })
            );
        }

        [Fact]
        public void GetFeatureAttributes_ReturnsNull_WhenFeatureDoesNotExist()
        {
            _featureManager.SetFeature("NonExistentFeature", false);
            var attributes = _service.GetFeatureAttributes("NonExistentFeature");
            Assert.Null(attributes);
        }

        [Fact]
        public void GetFeatureAttributes_ReturnsAttributes_WhenFeatureExists()
        {
            var expectedAttrs = new Dictionary<string, object>
            {
                { "MinUserTier", "Premium" }
            };
            _featureManager.SetFeature("TestFeature", true, expectedAttrs);
            var attributes = _service.GetFeatureAttributes("TestFeature");
            Assert.NotNull(attributes);
            Assert.Equal(expectedAttrs["MinUserTier"], attributes["MinUserTier"]);
        }

        [Fact]
        public void InitializeFeatures_SetsAttributesCorrectly()
        {
            var attrs = new Dictionary<string, object>
            {
                { "MinUserTier", "Premium" }
            };
            var optionsObj = new FeatureConfigOptions { RolloutPercentage = 50 };
            var options = new FeatureToggleServiceOptions
            {
                Environment = FeatureEnvironment.Development,
                Features = new List<FeatureConfig>
                {
                    new FeatureConfig
                    {
                        Name = "TestFeature",
                        Enabled = true,
                        Attributes = attrs,
                        Options = optionsObj
                    }
                }
            };
            var service = new FeatureToggleService(
                _featureManager,
                Mock.Of<IFeatureAuditLogger>(),
                Mock.Of<IFeatureChangePropagator>(),
                Mock.Of<IFeaturePromotionWorkflow>(),
                Mock.Of<IFeatureApiIntegration>(),
                Options.Create(options)
            );
            _featureManager.SetFeature("TestFeature", true, attrs);
            var attributes = service.GetFeatureAttributes("TestFeature");
            Assert.NotNull(attributes);
            Assert.Equal("Premium", attributes["MinUserTier"]);
        }

        [Fact]
        public void GetFeatureAttributes_ReturnsNull_WhenFeatureHasNoAttributes()
        {
            _featureManager.SetFeature("TestFeature", true);
            var attributes = _service.GetFeatureAttributes("TestFeature");
            Assert.Null(attributes);
        }

        [Fact]
        public void SetFeature_UpdatesAttributes_WhenFeatureExists()
        {
            var updatedAttrs = new Dictionary<string, object>
            {
                { "MinUserTier", "Premium" }
            };
            _featureManager.SetFeature("TestFeature", true, updatedAttrs);
            var attributes = _service.GetFeatureAttributes("TestFeature");
            Assert.NotNull(attributes);
            Assert.Equal("Premium", attributes["MinUserTier"]);
        }

        [Fact]
        public async Task IsFeatureEnabledForUserAsync_ReturnsFalse_WhenKillSwitchIsActive()
        {
            var attrs = new Dictionary<string, object> { { "KillSwitch", true } };
            _featureManager.SetFeature("TestFeature", true, attrs);
            var userContext = new FeatureToggleService.UserContext { UserId = "user1" };
            var isEnabled = await _service.IsFeatureEnabledForUserAsync("TestFeature", userContext);
            Assert.False(isEnabled);
        }

        [Fact]
        public async Task IsFeatureEnabledForUserAsync_ReturnsTrue_WhenUserIsInAllowList()
        {
            var attrs = new Dictionary<string, object> { { "AllowList", new List<string> { "user1" } } };
            _featureManager.SetFeature("TestFeature", true, attrs);
            var userContext = new FeatureToggleService.UserContext { UserId = "user1" };
            var isEnabled = await _service.IsFeatureEnabledForUserAsync("TestFeature", userContext);
            Assert.True(isEnabled);
        }

        [Fact]
        public async Task IsFeatureEnabledForUserAsync_ReturnsFalse_WhenUserIsInDenyList()
        {
            var attrs = new Dictionary<string, object> { { "DenyList", new List<string> { "user1" } } };
            _featureManager.SetFeature("TestFeature", true, attrs);
            var userContext = new FeatureToggleService.UserContext { UserId = "user1" };
            var isEnabled = await _service.IsFeatureEnabledForUserAsync("TestFeature", userContext);
            Assert.False(isEnabled);
        }

        [Fact]
        public async Task IsFeatureEnabledForUserAsync_ReturnsTrue_BasedOnRolloutPercentage()
        {
            var attrs = new Dictionary<string, object>();
            _featureManager.SetFeature("TestFeature", true, attrs);
            var options = new FeatureConfigOptions { RolloutPercentage = 50 };
            var optionsObj = new FeatureToggleServiceOptions
            {
                Environment = FeatureEnvironment.Development,
                Features = new List<FeatureConfig>
                {
                    new FeatureConfig
                    {
                        Name = "TestFeature",
                        Enabled = true,
                        Attributes = attrs,
                        Options = options
                    }
                }
            };
            var service = new FeatureToggleService(
                _featureManager,
                Mock.Of<IFeatureAuditLogger>(),
                Mock.Of<IFeatureChangePropagator>(),
                Mock.Of<IFeaturePromotionWorkflow>(),
                Mock.Of<IFeatureApiIntegration>(),
                Options.Create(optionsObj)
            );
            var userContext = new FeatureToggleService.UserContext { UserId = "user1" };
            var isEnabled = await service.IsFeatureEnabledForUserAsync("TestFeature", userContext);
            Assert.True(isEnabled);
        }

        [Fact]
        public async Task IsFeatureEnabledForUserAsync_ReturnsFalse_WhenGloballyDisabled()
        {
            var attrs = new Dictionary<string, object> { { "Enabled", false } };
            _featureManager.SetFeature("TestFeature", true, attrs);
            var userContext = new FeatureToggleService.UserContext { UserId = "user1" };
            var isEnabled = await _service.IsFeatureEnabledForUserAsync("TestFeature", userContext);
            Assert.False(isEnabled);
        }
    }
}