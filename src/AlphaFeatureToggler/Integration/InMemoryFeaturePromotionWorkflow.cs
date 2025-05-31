using AlphaFeatureToggler.Core;

namespace AlphaFeatureToggler.Integration
{
    /// <summary>
    /// In-memory implementation of promotion workflow for demonstration.
    /// To promote the feature, you can call the methods directly.
    /// This is a simple implementation and does not persist any state.
    /// Key points:
    /// It provides asynchronous methods to request, approve, and reject feature promotions.
    /// All methods return Task.CompletedTask, meaning they do nothing and complete immediately.
    /// This class is typically used for demonstration, testing, or development purposes where a real workflow or database is not needed.

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
