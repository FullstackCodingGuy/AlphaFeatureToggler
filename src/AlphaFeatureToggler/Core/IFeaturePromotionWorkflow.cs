using System.Threading.Tasks;

namespace AlphaFeatureToggler.Core
{
    /// <summary>
    /// Interface for feature promotion workflow.
    /// </summary>
    public interface IFeaturePromotionWorkflow
    {
        Task RequestPromotionAsync(string featureName, FeatureEnvironment fromEnv, FeatureEnvironment toEnv, string userId);
        Task ApprovePromotionAsync(string featureName, FeatureEnvironment fromEnv, FeatureEnvironment toEnv, string approverId);
        Task RejectPromotionAsync(string featureName, FeatureEnvironment fromEnv, FeatureEnvironment toEnv, string approverId, string reason);
    }
}
