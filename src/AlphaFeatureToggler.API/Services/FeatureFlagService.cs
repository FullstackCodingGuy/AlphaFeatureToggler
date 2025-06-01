using System.Security.Claims;
using AlphaFeatureToggler.API.Models;
using AlphaFeatureToggler.API.Repositories;

namespace AlphaFeatureToggler.API.Services;

public interface IFeatureFlagService
{
    IEnumerable<FeatureFlag> GetAllFeatureFlags();
    FeatureFlag? GetFeatureFlagById(Guid id);
    FeatureFlag CreateFeatureFlag(FeatureFlag featureFlag);
    FeatureFlag? UpdateFeatureFlag(Guid id, FeatureFlag featureFlag);
    bool DeleteFeatureFlag(Guid id);
}

public class FeatureFlagService : IFeatureFlagService
{
    private readonly IFeatureFlagRepository _featureFlagRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public FeatureFlagService(IFeatureFlagRepository featureFlagRepository, IHttpContextAccessor httpContextAccessor)
    {
        _featureFlagRepository = featureFlagRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    private bool UserHasAccess(FeatureFlag featureFlag)
    {
        var userRoles = _httpContextAccessor.HttpContext?.User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();
        return userRoles != null && featureFlag.AllowedRoles.Any(role => userRoles.Contains(role));
    }

    public IEnumerable<FeatureFlag> GetAllFeatureFlags()
    {
        return _featureFlagRepository.GetAll();
    }

    public FeatureFlag? GetFeatureFlagById(Guid id)
    {
        var featureFlag = _featureFlagRepository.GetById(id);
        if (featureFlag != null && !UserHasAccess(featureFlag))
        {
            throw new UnauthorizedAccessException("User does not have access to this feature flag.");
        }
        return featureFlag;
    }

    public FeatureFlag CreateFeatureFlag(FeatureFlag featureFlag)
    {
        if (!UserHasAccess(featureFlag))
        {
            throw new UnauthorizedAccessException("User does not have access to create this feature flag.");
        }
        return _featureFlagRepository.Add(featureFlag);
    }

    public FeatureFlag? UpdateFeatureFlag(Guid id, FeatureFlag featureFlag)
    {
        var existingFeatureFlag = _featureFlagRepository.GetById(id);
        if (existingFeatureFlag == null || !UserHasAccess(existingFeatureFlag))
        {
            throw new UnauthorizedAccessException("User does not have access to update this feature flag.");
        }

        featureFlag.Id = id;
        return _featureFlagRepository.Update(featureFlag);
    }

    public bool DeleteFeatureFlag(Guid id)
    {
        var featureFlag = _featureFlagRepository.GetById(id);
        if (featureFlag == null || !UserHasAccess(featureFlag))
        {
            throw new UnauthorizedAccessException("User does not have access to delete this feature flag.");
        }
        return _featureFlagRepository.Delete(id);
    }
}
