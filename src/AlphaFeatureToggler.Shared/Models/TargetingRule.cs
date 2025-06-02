namespace AlphaFeatureToggler.Shared.Models;

public class TargetingRule
{
    public string AttributeName { get; set; } = string.Empty;
    public string ExpectedValue { get; set; } = string.Empty;

    public bool Matches(IDictionary<string, string> userAttributes)
    {
        return userAttributes.TryGetValue(AttributeName, out var value) && value == ExpectedValue;
    }
}