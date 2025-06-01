namespace AlphaFeatureToggler.API.Models;

public class FeatureFlag
{
    public Guid Id { get; set; } // Changed from int to Guid
    public string? Name { get; set; } // Made nullable to resolve warning
    public bool IsEnabled { get; set; }
    public List<string> AllowedRoles { get; set; } = new(); // Roles allowed to manage this feature flag
    public List<TargetingRule> TargetingRules { get; set; } = new(); // Added TargetingRules property
    public string? Type { get; set; } // e.g., Boolean, Multivariate
    public List<string> Environments { get; set; } = new(); // e.g., Dev, QA, Stage, Prod
    public int RolloutProgress { get; set; } // 0-100
}
