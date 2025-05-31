namespace AlphaFeatureToggler.Core
{
    /// <summary>
    /// Represents a kill switch state for a feature.
    /// Purpose: Represents an emergency override to immediately disable (or "kill") a feature, regardless of its normal configuration.
    /// Usage: Used when a feature is causing issues (e.g., a bug or outage) and needs to be turned off instantly for everyone, bypassing all normal rules.
    /// Example: Even if FeatureConfig says the feature is enabled for some users, if the kill switch is active, the feature is off for all.
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



// FeatureKillSwitch vs FeatureConfig
// Why Not Just Use One?
// Separation of Concerns: FeatureConfig is for planned, gradual, or targeted rollout. FeatureKillSwitch is for urgent, global shutdown.
// Safety: The kill switch provides a quick, centralized way to disable a feature in emergencies, without modifying complex configs.
// Logic: In code, you typically check the kill switch first. If it’s active, the feature is off, no matter what the config says.


// Summary Table
// FeatureConfig	FeatureKillSwitch
// Normal rollout	Yes	No
// Emergency stop	No	Yes
// Granular rules	Yes	No
// Overrides all	No	Yes

// In short:

// Use FeatureConfig for normal feature management.
// Use FeatureKillSwitch for emergency, global shutdowns.
// Both are needed for a robust, safe feature toggling system.