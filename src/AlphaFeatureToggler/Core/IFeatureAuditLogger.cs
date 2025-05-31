namespace AlphaFeatureToggler.Core
{
    /// <summary>
    /// Interface for audit logging feature toggle actions.
    /// </summary>
    public interface IFeatureAuditLogger
    {
        Task LogAsync(FeatureAuditLog logEntry);
    }
}
