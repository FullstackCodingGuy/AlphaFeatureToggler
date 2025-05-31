using System.Threading.Tasks;
using System.Collections.Generic;
using AlphaFeatureToggler.Core;

namespace AlphaFeatureToggler.Integration
{
    /// <summary>
    /// In-memory implementation of audit logger for demonstration.
    /// </summary>
    public class InMemoryFeatureAuditLogger : IFeatureAuditLogger
    {
        public List<FeatureAuditLog> Logs { get; } = new();

        public Task LogAsync(FeatureAuditLog logEntry)
        {
            Logs.Add(logEntry);
            return Task.CompletedTask;
        }
    }
}
