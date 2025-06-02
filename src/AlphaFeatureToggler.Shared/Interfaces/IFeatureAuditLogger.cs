using AlphaFeatureToggler.Shared.Models;

namespace AlphaFeatureToggler.Shared.Interfaces;

public interface IFeatureAuditLogger
{
    Task LogFeatureAccessAsync(string featureName, string userId, bool wasEnabled, IDictionary<string, string>? attributes = null);
    Task LogFeatureStateChangeAsync(string featureName, bool newState, string? changedBy = null);
    Task LogFeatureConfigUpdateAsync(string featureName, FeatureFlag newConfig, string? updatedBy = null);
}