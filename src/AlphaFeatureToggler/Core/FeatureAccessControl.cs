namespace AlphaFeatureToggler.Core
{
    /// <summary>
    /// Represents access control rules for feature toggles.
    /// </summary>
    public class FeatureAccessControl
    {
        public string FeatureName { get; set; } = string.Empty;
        public FeatureEnvironment Environment { get; set; }
        public List<string> AllowedUserIds { get; set; } = new();
        public List<string> AllowedRoles { get; set; } = new();
    }
}
