namespace AlphaFeatureToggler.Core
{
    /// <summary>
    /// Interface for propagating feature toggle changes to other systems or services.
    /// </summary>
    public interface IFeatureChangePropagator
    {
        Task PropagateChangeAsync(string featureName, FeatureEnvironment environment, string action, string userId);
    }
}
