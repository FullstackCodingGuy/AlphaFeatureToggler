namespace AlphaFeatureToggler.Core
{
    /// <summary>
    /// Interface for feature toggle service.
    /// </summary>
    public interface IFeatureToggleService
    {
        Task<bool> IsEnabledAsync(string featureName, FeatureEnvironment? environment = null);
        Task<bool> IsKillSwitchActiveAsync(string featureName, FeatureEnvironment? environment = null);
        Task ActivateKillSwitchAsync(string featureName, FeatureEnvironment environment, string reason, string userId);
        Task DeactivateKillSwitchAsync(string featureName, FeatureEnvironment environment, string userId);
        Task PromoteFeatureAsync(string featureName, FeatureEnvironment fromEnv, FeatureEnvironment toEnv, string userId);
        // ...other methods for audit, access control, etc.
    }
}
