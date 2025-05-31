namespace AlphaFeatureToggler.Core
{
    /// <summary>
    /// Represents a kill switch state for a feature.
    /// </summary>
    public class FeatureKillSwitch
    {
        public string FeatureName { get; set; } = string.Empty;
        public FeatureEnvironment Environment { get; set; }
        public bool IsActive { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string ActivatedBy { get; set; } = string.Empty;
        public DateTime? ActivatedAt { get; set; }
    }
}
