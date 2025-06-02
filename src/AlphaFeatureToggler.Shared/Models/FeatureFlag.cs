namespace AlphaFeatureToggler.Shared.Models;

public class FeatureFlag
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public bool IsEnabled { get; set; }
    public List<string> AllowedRoles { get; set; } = new();
    public List<TargetingRule> TargetingRules { get; set; } = new();
    public string? Type { get; set; }
    public List<string> Environments { get; set; } = new();
    public int RolloutProgress { get; set; }
}