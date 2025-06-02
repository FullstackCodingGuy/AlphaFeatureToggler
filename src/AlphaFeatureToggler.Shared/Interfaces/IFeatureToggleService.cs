using AlphaFeatureToggler.Shared.Models;
using AlphaFeatureToggler.Shared.Enums;

namespace AlphaFeatureToggler.Shared.Interfaces;

public interface IFeatureToggleService
{
    Task<bool> IsFeatureEnabledAsync(string featureName);
    Task<bool> IsFeatureEnabledForUserAsync(string featureName, string userId, IDictionary<string, string>? attributes = null);
    Task<bool> SetFeatureStateAsync(string featureName, bool enabled);
    Task<IEnumerable<string>> GetFeatureNamesAsync();
    Task<FeatureFlag?> GetFeatureConfigAsync(string featureName);
    Task<bool> UpdateFeatureConfigAsync(string featureName, FeatureFlag config);
}