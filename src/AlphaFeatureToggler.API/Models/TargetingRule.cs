namespace AlphaFeatureToggler.API.Models;

public class TargetingRule
{
    public string AttributeName { get; set; } = string.Empty; // Name of the user attribute
    public string ExpectedValue { get; set; } = string.Empty; // Expected value for the attribute

    public bool Matches(IDictionary<string, string> userAttributes)
    {
        return userAttributes.TryGetValue(AttributeName, out var value) && value == ExpectedValue;
    }
}
