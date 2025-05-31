using System.Threading.Tasks;
using AlphaFeatureToggler.Core;

namespace AlphaFeatureToggler.Integration
{
    /// <summary>
    /// In-memory implementation of change propagator for demonstration.
    /// </summary>
    public class InMemoryFeatureChangePropagator : IFeatureChangePropagator
    {
        public Task PropagateChangeAsync(string featureName, FeatureEnvironment environment, string action, string userId)
        {
            // Simulate propagation (e.g., log or notify)
            return Task.CompletedTask;
        }
    }
}
