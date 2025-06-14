using AlphaFeatureToggler.Models;

namespace AlphaFeatureToggler.API.Repositories;

public interface IFeatureFlagRepository
{
    IEnumerable<FeatureFlag> GetAll();
    FeatureFlag? GetById(Guid id);
    FeatureFlag Add(FeatureFlag featureFlag);
    FeatureFlag Update(FeatureFlag featureFlag);
    bool Delete(Guid id);
}

public class FeatureFlagRepository : IFeatureFlagRepository
{
    private readonly List<FeatureFlag> _featureFlags = new();

    public IEnumerable<FeatureFlag> GetAll()
    {
        return _featureFlags;
    }

    public FeatureFlag? GetById(Guid id)
    {
        return _featureFlags.FirstOrDefault(f => f.Id == id);
    }

    public FeatureFlag Add(FeatureFlag featureFlag)
    {
        featureFlag.Id = Guid.NewGuid();
        _featureFlags.Add(featureFlag);
        return featureFlag;
    }

    public FeatureFlag Update(FeatureFlag featureFlag)
    {
        var existingFeatureFlag = GetById(featureFlag.Id);
        if (existingFeatureFlag != null)
        {
            // Update all properties
            existingFeatureFlag.Name = featureFlag.Name;
            existingFeatureFlag.IsEnabled = featureFlag.IsEnabled;
            existingFeatureFlag.AllowedRoles = featureFlag.AllowedRoles;
            existingFeatureFlag.TargetingRules = featureFlag.TargetingRules;
            existingFeatureFlag.Type = featureFlag.Type;
            existingFeatureFlag.Environments = featureFlag.Environments;
            existingFeatureFlag.RolloutProgress = featureFlag.RolloutProgress;
        }
        return existingFeatureFlag ?? featureFlag;
    }

    public bool Delete(Guid id)
    {
        var featureFlag = GetById(id);
        if (featureFlag != null)
        {
            _featureFlags.Remove(featureFlag);
            return true;
        }
        return false;
    }
}
