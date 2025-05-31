using Microsoft.FeatureManagement;
using Microsoft.Extensions.Options;
using System.Collections.Concurrent;
using Microsoft.Extensions.Caching.Memory;

namespace AlphaFeatureToggler.Core
{

    /// <summary>
    /// Implementation of the feature toggle service.
    /// </summary>
    public class FeatureToggleService : IFeatureToggleService
    {
        private readonly IFeatureManager _featureManager;
        private readonly IFeatureAuditLogger _auditLogger;
        private readonly IFeatureChangePropagator _changePropagator;
        private readonly IFeaturePromotionWorkflow _promotionWorkflow;
        private readonly IFeatureApiIntegration _apiIntegration;
        private readonly FeatureToggleServiceOptions _options;
        private static readonly ConcurrentDictionary<(string, FeatureEnvironment), bool> _killSwitches = new();
        private static readonly ConcurrentDictionary<(string, FeatureEnvironment), HashSet<string>> _featureAccess = new();
        private readonly IMemoryCache _cache = new MemoryCache(new MemoryCacheOptions());

        public FeatureToggleService(
            IFeatureManager featureManager,
            IFeatureAuditLogger auditLogger,
            IFeatureChangePropagator changePropagator,
            IFeaturePromotionWorkflow promotionWorkflow,
            IFeatureApiIntegration apiIntegration,
            IOptions<FeatureToggleServiceOptions> optionsAccessor)
        {
            _featureManager = featureManager;
            _auditLogger = auditLogger;
            _changePropagator = changePropagator;
            _promotionWorkflow = promotionWorkflow;
            _apiIntegration = apiIntegration;
            _options = optionsAccessor.Value;
        }

        public async Task<bool> IsEnabledAsync(string featureName, FeatureEnvironment? environment = null)
        {
            var env = environment ?? _options.Environment;
            var cacheKey = $"feature:{featureName}:{env}";
            if (_options.EnableCaching)
            {
                if (_cache.TryGetValue(cacheKey, out bool cached))
                    return cached;
            }
            if (await IsKillSwitchActiveAsync(featureName, env))
            {
                if (_options.EnableCaching)
                    _cache.Set(cacheKey, false, TimeSpan.FromSeconds(_options.FeatureCacheSeconds));
                return false;
            }
            var enabled = await _featureManager.IsEnabledAsync(featureName);
            if (_options.EnableCaching)
                _cache.Set(cacheKey, enabled, TimeSpan.FromSeconds(_options.FeatureCacheSeconds));
            return enabled;
        }

        public Task<bool> IsKillSwitchActiveAsync(string featureName, FeatureEnvironment? environment = null)
        {
            var env = environment ?? _options.Environment;
            return Task.FromResult(_killSwitches.TryGetValue((featureName, env), out var active) && active);
        }

        public async Task ActivateKillSwitchAsync(string featureName, FeatureEnvironment environment, string reason, string userId)
        {
            _killSwitches[(featureName, environment)] = true;
            await _auditLogger.LogAsync(new FeatureAuditLog
            {
                FeatureName = featureName,
                Environment = environment,
                Action = "KillSwitchActivated",
                UserId = userId,
                Details = reason,
                Timestamp = System.DateTime.UtcNow
            });
            await _changePropagator.PropagateChangeAsync(featureName, environment, "KillSwitchActivated", userId);
        }

        public async Task DeactivateKillSwitchAsync(string featureName, FeatureEnvironment environment, string userId)
        {
            _killSwitches[(featureName, environment)] = false;
            await _auditLogger.LogAsync(new FeatureAuditLog
            {
                FeatureName = featureName,
                Environment = environment,
                Action = "KillSwitchDeactivated",
                UserId = userId,
                Timestamp = System.DateTime.UtcNow
            });
            await _changePropagator.PropagateChangeAsync(featureName, environment, "KillSwitchDeactivated", userId);
        }

        public async Task PromoteFeatureAsync(string featureName, FeatureEnvironment fromEnv, FeatureEnvironment toEnv, string userId)
        {
            await _promotionWorkflow.RequestPromotionAsync(featureName, fromEnv, toEnv, userId);
        }

        // Call this method to clear the cache (e.g., after config change or flag update)
        public void ClearFeatureCache()
        {
            if (_options.EnableCaching && _cache is MemoryCache memCache)
                memCache.Compact(1.0); // Remove all entries
        }

        // New: Get feature attributes
        public Dictionary<string, object>? GetFeatureAttributes(string featureName)
        {
            if (_featureManager is Integration.InMemoryFeatureManager mgr)
                return mgr.GetAttributes(featureName);
            return null;
        }

        // Updated: Feature rollout strategy implementation
        public async Task<bool> IsFeatureEnabledForUserAsync(string featureName, UserContext userContext, FeatureEnvironment? environment = null)
        {
            var env = environment ?? _options.Environment;
            var attributes = GetFeatureAttributes(featureName);
            var featureConfig = _options.Features?.FirstOrDefault(f => f.Name == featureName);
            var options = featureConfig?.Options;

            if (attributes != null)
            {
                // Check for kill switch
                if (attributes.TryGetValue("KillSwitch", out var killSwitch) && killSwitch is bool isKillSwitchActive && isKillSwitchActive)
                {
                    return false;
                }

                // Check if globally disabled
                if (attributes.TryGetValue("Enabled", out var isEnabled) && isEnabled is bool globallyEnabled && !globallyEnabled)
                {
                    return false;
                }

                // Check allow list
                if (attributes.TryGetValue("AllowList", out var allowList) && allowList is List<string> allowedUsers)
                {
                    if (allowedUsers.Contains(userContext.UserId))
                        return true;
                }

                // Check deny list
                if (attributes.TryGetValue("DenyList", out var denyList) && denyList is List<string> deniedUsers)
                {
                    if (deniedUsers.Contains(userContext.UserId))
                        return false;
                }
            }

            // Check SpecificUsers in Options
            if (options != null && options.SpecificUsers != null && options.SpecificUsers.Count > 0)
            {
                if (options.SpecificUsers.Contains(userContext.UserId))
                    return true;
            }

            // Check SpecificUserGroups in Options (if userContext.Segment is used as group)
            if (options != null && options.SpecificUserGroups != null && options.SpecificUserGroups.Count > 0)
            {
                if (!string.IsNullOrEmpty(userContext.Segment) && options.SpecificUserGroups.Contains(userContext.Segment))
                    return true;
            }

            // Check rollout percentage in Options
            if (options != null)
            {
                var percentage = options.RolloutPercentage;
                var bucketValue = GetBucketValue(userContext.UserId, featureName);
                if (bucketValue < percentage)
                    return true;
            }

            // Fallback to global flag state
            return await IsEnabledAsync(featureName, env);
        }

        private int GetBucketValue(string userId, string featureName)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var hash = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(userId + featureName));
            return BitConverter.ToInt32(hash, 0) % 100;
        }

        // Define UserContext class for feature rollout strategy
        public class UserContext
        {
            public string UserId { get; set; } = string.Empty;
            public string? Email { get; set; }
            public string? Segment { get; set; }
            public bool IsInternal { get; set; }
        }
    }
}
