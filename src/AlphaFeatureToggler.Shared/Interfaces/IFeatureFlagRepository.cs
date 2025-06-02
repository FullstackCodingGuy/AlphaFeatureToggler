using AlphaFeatureToggler.Shared.Models;

namespace AlphaFeatureToggler.Shared.Interfaces;

public interface IFeatureFlagRepository
{
    IEnumerable<FeatureFlag> GetAll();
    FeatureFlag? GetById(Guid id);
    FeatureFlag Add(FeatureFlag featureFlag);
    FeatureFlag Update(FeatureFlag featureFlag);
    bool Delete(Guid id);
}