namespace AlphaFeatureToggler.Core
{
    /// <summary>
    /// Purpose: Represents the normal configuration for a feature (e.g., enabled/disabled, rollout percentage, targeting rules).
    /// Usage: Used to control how and when a feature is available to users under normal circumstances.
    /// Example: You might enable a feature for 50% of users in production, or only for a specific group.
    /// </summary>
    public class FeatureConfig
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool Enabled { get; set; }

        /// <summary>
        /// Custom attributes of users
        /// </summary>
        public Dictionary<string, object>? Attributes { get; set; }

        public FeatureConfigOptions Options { get; set; } = new FeatureConfigOptions();
    }

    public class FeatureConfigOptions
    {
        // rollout percentage for the feature
        public int RolloutPercentage { get; set; } = 100;

        // whether the feature is enabled for all users
        public bool IsEnabledForAllUsers { get; set; } = false;

        // whether the feature is enabled for specific users
        public bool IsEnabledForSpecificUsers { get; set; } = false;
        public List<string> SpecificUsers { get; set; } = new List<string>();

        // whether the feature is enabled for specific user groups
        public bool IsEnabledForSpecificUserGroups { get; set; } = false;
        public List<string> SpecificUserGroups { get; set; } = new List<string>();

        public List<string> AllowedRoles { get; set; } = new List<string>();
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