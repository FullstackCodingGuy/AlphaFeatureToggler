using System.Threading.Tasks;
using AlphaFeatureToggler.Core;

namespace AlphaFeatureToggler.Integration
{
    /// <summary>
    /// In-memory implementation of API integration for demonstration.
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
