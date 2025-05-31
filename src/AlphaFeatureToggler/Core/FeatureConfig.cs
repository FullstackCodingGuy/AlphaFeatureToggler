namespace AlphaFeatureToggler.Core
{
    public class FeatureConfig
    {
        public string Name { get; set; } = string.Empty;
        public bool Enabled { get; set; }
        public Dictionary<string, object>? Attributes { get; set; }
    }
}
