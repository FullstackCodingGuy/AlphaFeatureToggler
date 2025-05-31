using System.Threading.Tasks;
using AlphaFeatureToggler.Core;

namespace AlphaFeatureToggler.Integration
{
    /// <summary>
    /// In-memory implementation of promotion workflow for demonstration.
    /// </summary>
    public class InMemoryFeaturePromotionWorkflow : IFeaturePromotionWorkflow
    {
        public Task RequestPromotionAsync(string featureName, FeatureEnvironment fromEnv, FeatureEnvironment toEnv, string userId)
        {
            // Simulate promotion request
            return Task.CompletedTask;
        }

        public Task ApprovePromotionAsync(string featureName, FeatureEnvironment fromEnv, FeatureEnvironment toEnv, string approverId)
        {
            // Simulate approval
            return Task.CompletedTask;
        }

        public Task RejectPromotionAsync(string featureName, FeatureEnvironment fromEnv, FeatureEnvironment toEnv, string approverId, string reason)
        {
            // Simulate rejection
            return Task.CompletedTask;
        }
    }
}
