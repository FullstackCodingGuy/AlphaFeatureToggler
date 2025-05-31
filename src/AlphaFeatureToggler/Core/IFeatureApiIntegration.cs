namespace AlphaFeatureToggler.Core
{
    /// <summary>
    /// Interface for API integration for feature toggles.
    /// </summary>
    public interface IFeatureApiIntegration
    {
        Task<bool> SyncFeatureStateAsync(string featureName, FeatureEnvironment environment);
        Task<bool> NotifyExternalSystemAsync(string featureName, FeatureEnvironment environment, string action);
    }
}
