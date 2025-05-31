namespace AlphaFeatureToggler.Core
{
    /// <summary>
    /// Represents an audit log entry for feature toggle actions.
    /// </summary>
    public class FeatureAuditLog
    {
        public DateTime Timestamp { get; set; }
        public string FeatureName { get; set; } = string.Empty;
        public FeatureEnvironment Environment { get; set; }
        public string Action { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
    }
}
