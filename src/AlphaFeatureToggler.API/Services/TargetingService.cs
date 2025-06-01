using AlphaFeatureToggler.API.Models;
using AlphaFeatureToggler.API.Repositories;

namespace AlphaFeatureToggler.API.Services;

public interface ITargetingService
{
    bool IsFeatureEnabledForUser(string featureName, string userId, IDictionary<string, string> userAttributes);
}

public class TargetingService : ITargetingService
{
    private readonly IFeatureFlagRepository _featureFlagRepository;

    public TargetingService(IFeatureFlagRepository featureFlagRepository)
    {
        _featureFlagRepository = featureFlagRepository;
    }

    public bool IsFeatureEnabledForUser(string featureName, string userId, IDictionary<string, string> userAttributes)
    {
        var featureFlag = _featureFlagRepository.GetAll().FirstOrDefault(f => f.Name == featureName);
        if (featureFlag == null || !featureFlag.IsEnabled)
        {
            return false;
        }

        // Example targeting logic based on user attributes
        if (featureFlag.TargetingRules != null && featureFlag.TargetingRules.Any())
        {
            foreach (var rule in featureFlag.TargetingRules)
            {
                if (rule.Matches(userAttributes))
                {
                    return true;
                }
            }
        }

        return false;
    }
}
