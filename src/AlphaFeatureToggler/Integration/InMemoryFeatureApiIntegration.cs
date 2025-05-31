using AlphaFeatureToggler.Core;

namespace AlphaFeatureToggler.Integration
{
    /// <summary>
    /// In-memory implementation of API integration for demonstration.
    /// Key points:
    // Used for demonstration, testing, or development.
    // SyncFeatureStateAsync simulates syncing a feature's state with an external system and always returns true.
    // NotifyExternalSystemAsync simulates notifying an external system about a feature action and always returns true.
    // No actual API calls or state changes occur; everything is handled in memory.
    /// </summary>
    public class InMemoryFeatureApiIntegration : IFeatureApiIntegration
    {
        public Task<bool> SyncFeatureStateAsync(string featureName, FeatureEnvironment environment)
        {
            // Simulate API sync
            return Task.FromResult(true);
        }

        public Task<bool> NotifyExternalSystemAsync(string featureName, FeatureEnvironment environment, string action)
        {
            // Simulate notification
            return Task.FromResult(true);
        }
    }
}
