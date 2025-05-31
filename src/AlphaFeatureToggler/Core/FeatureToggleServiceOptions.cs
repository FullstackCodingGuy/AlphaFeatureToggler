namespace AlphaFeatureToggler.Core
{
    public class FeatureToggleServiceOptions
    {
        public FeatureEnvironment Environment { get; set; } = FeatureEnvironment.Production;
        public int FeatureCacheSeconds { get; set; } = 30;
        public bool EnableCaching { get; set; } = false;
        public List<FeatureConfig>? Features { get; set; } // List of feature configs for startup
    }
}