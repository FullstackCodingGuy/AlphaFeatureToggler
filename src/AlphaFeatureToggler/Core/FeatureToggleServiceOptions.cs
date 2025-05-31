namespace AlphaFeatureToggler.Core
{
    public class FeatureToggleServiceOptions
    {
        public FeatureEnvironment Environment { get; set; } = FeatureEnvironment.Production;
        public int FeatureCacheSeconds { get; set; } = 30;
        public bool EnableCaching { get; set; } = false;
    }
}