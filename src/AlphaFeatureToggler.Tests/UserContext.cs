namespace AlphaFeatureToggler.Tests
{
    public class UserContext
    {
        public string UserId { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Segment { get; set; }
        public bool IsInternal { get; set; }
    }
}
