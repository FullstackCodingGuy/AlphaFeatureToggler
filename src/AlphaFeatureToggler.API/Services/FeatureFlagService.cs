using System.Security.Claims;
using AlphaFeatureToggler.Models;
using AlphaFeatureToggler.API.Repositories;

namespace AlphaFeatureToggler.API.Services;

public interface IFeatureFlagService
{
    IEnumerable<FeatureFlag> GetAllFeatureFlags();
    FeatureFlag? GetFeatureFlagById(Guid id);
    FeatureFlag CreateFeatureFlag(FeatureFlag featureFlag);
    FeatureFlag? UpdateFeatureFlag(Guid id, FeatureFlag featureFlag);
    bool DeleteFeatureFlag(Guid id);
    IEnumerable<FeatureFlag> SearchFeatureFlags(string? query, string? status, string? type, string? environment, int page, int pageSize);
    int GetRolloutProgress(Guid id);
    int UpdateRolloutProgress(Guid id, int progress);
    List<TargetingRule> GetTargetingRules(Guid id);
    List<TargetingRule> UpdateTargetingRules(Guid id, List<TargetingRule> rules);
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

    public IEnumerable<FeatureFlag> SearchFeatureFlags(string? query, string? status, string? type, string? environment, int page, int pageSize)
    {
        var all = _featureFlagRepository.GetAll();
        if (!string.IsNullOrEmpty(query))
            all = all.Where(f => f.Name != null && f.Name.Contains(query, StringComparison.OrdinalIgnoreCase));
        if (!string.IsNullOrEmpty(status))
            all = all.Where(f => f.IsEnabled == (status.ToLower() == "active"));
        if (!string.IsNullOrEmpty(type))
            all = all.Where(f => f.Type != null && f.Type.Equals(type, StringComparison.OrdinalIgnoreCase));
        if (!string.IsNullOrEmpty(environment))
            all = all.Where(f => f.Environments != null && f.Environments.Contains(environment, StringComparer.OrdinalIgnoreCase));
        return all.Skip((page - 1) * pageSize).Take(pageSize);
    }

    public int GetRolloutProgress(Guid id)
    {
        var flag = _featureFlagRepository.GetById(id);
        return flag?.RolloutProgress ?? 0;
    }

    public int UpdateRolloutProgress(Guid id, int progress)
    {
        var flag = _featureFlagRepository.GetById(id);
        if (flag == null) return 0;
        flag.RolloutProgress = progress;
        _featureFlagRepository.Update(flag);
        return flag.RolloutProgress;
    }

    public List<TargetingRule> GetTargetingRules(Guid id)
    {
        var flag = _featureFlagRepository.GetById(id);
        return flag?.TargetingRules ?? new List<TargetingRule>();
    }

    public List<TargetingRule> UpdateTargetingRules(Guid id, List<TargetingRule> rules)
    {
        var flag = _featureFlagRepository.GetById(id);
        if (flag == null) return new List<TargetingRule>();
        flag.TargetingRules = rules;
        _featureFlagRepository.Update(flag);
        return flag.TargetingRules;
    }
}
