using AlphaFeatureToggler.Core;
using AlphaFeatureToggler.Integration;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

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
                new InMemoryFeatureAuditLogger(),
                new InMemoryFeatureChangePropagator(),
                new InMemoryFeaturePromotionWorkflow(),
                new InMemoryFeatureApiIntegration(),
                Options.Create(new FeatureToggleServiceOptions { Environment = FeatureEnvironment.Development })
            );
        }

        [Fact]
        public void GetFeatureAttributes_ReturnsNull_WhenFeatureDoesNotExist()
        {
            // Act
            var attributes = _service.GetFeatureAttributes("NonExistentFeature");

            // Assert
            Assert.Null(attributes);
        }

        [Fact]
        public void GetFeatureAttributes_ReturnsAttributes_WhenFeatureExists()
        {
            // Arrange
            var expectedAttrs = new Dictionary<string, object>
            {
                { "MinUserTier", "Premium" },
                { "RolloutPercentage", 50 }
            };
            _featureManager.SetFeature("TestFeature", true, expectedAttrs);

            // Act
            var attributes = _service.GetFeatureAttributes("TestFeature");

            // Assert
            Assert.NotNull(attributes);
            Assert.Equal(expectedAttrs["MinUserTier"], attributes["MinUserTier"]);
            Assert.Equal(expectedAttrs["RolloutPercentage"], attributes["RolloutPercentage"]);
        }

        [Fact]
        public void InitializeFeatures_SetsAttributesCorrectly()
        {
            // Arrange
            var attrs = new Dictionary<string, object>
            {
                { "MinUserTier", "Premium" },
                { "RolloutPercentage", 50 }
            };
            _featureManager.SetFeature("TestFeature", true, attrs);

            var options = new FeatureToggleServiceOptions
            {
                Environment = FeatureEnvironment.Development,
                Features = new List<FeatureConfig>
                {
                    new FeatureConfig
                    {
                        Name = "TestFeature",
                        Enabled = true,
                        Attributes = attrs
                    }
                }
            };

            var service = new FeatureToggleService(
                _featureManager,
                new InMemoryFeatureAuditLogger(),
                new InMemoryFeatureChangePropagator(),
                new InMemoryFeaturePromotionWorkflow(),
                new InMemoryFeatureApiIntegration(),
                Options.Create(options)
            );

            // Act
            var attributes = service.GetFeatureAttributes("TestFeature");

            // Assert
            Assert.NotNull(attributes);
            Assert.Equal("Premium", attributes["MinUserTier"]);
            Assert.Equal(50, attributes["RolloutPercentage"]);
        }

        [Fact]
        public void GetFeatureAttributes_ReturnsNull_WhenFeatureHasNoAttributes()
        {
            // Arrange
            _featureManager.SetFeature("TestFeature", true);

            // Act
            var attributes = _service.GetFeatureAttributes("TestFeature");

            // Assert
            Assert.Null(attributes);
        }

        [Fact]
        public void SetFeature_UpdatesAttributes_WhenFeatureExists()
        {
            // Arrange
            var initialAttrs = new Dictionary<string, object>
            {
                { "MinUserTier", "Basic" }
            };
            _featureManager.SetFeature("TestFeature", true, initialAttrs);

            var updatedAttrs = new Dictionary<string, object>
            {
                { "MinUserTier", "Premium" },
                { "RolloutPercentage", 75 }
            };

            // Act
            _featureManager.SetFeature("TestFeature", true, updatedAttrs);
            var attributes = _service.GetFeatureAttributes("TestFeature");

            // Assert
            Assert.NotNull(attributes);
            Assert.Equal("Premium", attributes["MinUserTier"]);
            Assert.Equal(75, attributes["RolloutPercentage"]);
        }

        [Fact]
        public async Task IsFeatureEnabledForUserAsync_ReturnsFalse_WhenKillSwitchIsActive()
        {
            // Arrange
            _featureManager.SetFeature("TestFeature", true, new Dictionary<string, object>
            {
                { "KillSwitch", true }
            });

            var userContext = new AlphaFeatureToggler.Core.FeatureToggleService.UserContext { UserId = "user1" };

            // Act
            var isEnabled = await _service.IsFeatureEnabledForUserAsync("TestFeature", userContext);

            // Assert
            Assert.False(isEnabled);
        }

        [Fact]
        public async Task IsFeatureEnabledForUserAsync_ReturnsTrue_WhenUserIsInAllowList()
        {
            // Arrange
            _featureManager.SetFeature("TestFeature", true, new Dictionary<string, object>
            {
                { "AllowList", new List<string> { "user1" } }
            });

            var userContext = new AlphaFeatureToggler.Core.FeatureToggleService.UserContext { UserId = "user1" };

            // Act
            var isEnabled = await _service.IsFeatureEnabledForUserAsync("TestFeature", userContext);

            // Assert
            Assert.True(isEnabled);
        }

        [Fact]
        public async Task IsFeatureEnabledForUserAsync_ReturnsFalse_WhenUserIsInDenyList()
        {
            // Arrange
            _featureManager.SetFeature("TestFeature", true, new Dictionary<string, object>
            {
                { "DenyList", new List<string> { "user1" } }
            });

            var userContext = new AlphaFeatureToggler.Core.FeatureToggleService.UserContext { UserId = "user1" };

            // Act
            var isEnabled = await _service.IsFeatureEnabledForUserAsync("TestFeature", userContext);

            // Assert
            Assert.False(isEnabled);
        }

        [Fact]
        public async Task IsFeatureEnabledForUserAsync_ReturnsTrue_BasedOnRolloutPercentage()
        {
            // Arrange
            _featureManager.SetFeature("TestFeature", true, new Dictionary<string, object>
            {
                { "RolloutPercentage", 50 }
            });

            var userContext = new AlphaFeatureToggler.Core.FeatureToggleService.UserContext { UserId = "user1" };

            // Act
            var isEnabled = await _service.IsFeatureEnabledForUserAsync("TestFeature", userContext);

            // Assert
            // Assuming deterministic hashing places "user1" within the 50% rollout.
            Assert.True(isEnabled);
        }


        [Fact]
        public async Task IsFeatureEnabledForUserAsync_ReturnsFalse_WhenGloballyDisabled()
        {
            // Arrange
            _featureManager.SetFeature("TestFeature", true, new Dictionary<string, object>
            {
                { "Enabled", false }
            });

            var userContext = new AlphaFeatureToggler.Core.FeatureToggleService.UserContext { UserId = "user1" };

            // Act
            var isEnabled = await _service.IsFeatureEnabledForUserAsync("TestFeature", userContext);

            // Assert
            Assert.False(isEnabled);
        }
    }
}