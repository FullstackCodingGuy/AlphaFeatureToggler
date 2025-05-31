using System.Collections.Concurrent;

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

    public class BatchingFeatureAuditLogger : Core.IFeatureAuditLogger, IDisposable
    {
        private readonly ConcurrentQueue<Core.FeatureAuditLog> _queue = new();
        private readonly CancellationTokenSource _cts = new();
        private readonly Task _worker;
        private readonly int _batchSize;
        private readonly int _intervalMs;

        public BatchingFeatureAuditLogger(int batchSize = 10, int intervalMs = 1000)
        {
            _batchSize = batchSize;
            _intervalMs = intervalMs;
            _worker = Task.Run(ProcessQueueAsync);
        }

        public Task LogAsync(Core.FeatureAuditLog logEntry)
        {
            _queue.Enqueue(logEntry);
            return Task.CompletedTask;
        }

        private async Task ProcessQueueAsync()
        {
            var buffer = new List<Core.FeatureAuditLog>(_batchSize);
            while (!_cts.Token.IsCancellationRequested)
            {
                while (buffer.Count < _batchSize && _queue.TryDequeue(out var log))
                    buffer.Add(log);
                if (buffer.Count > 0)
                {
                    // Replace with real batch write (e.g., DB, file, etc.)
                    foreach (var entry in buffer)
                        System.Diagnostics.Debug.WriteLine($"[BATCH AUDIT] {entry.Timestamp:u} | {entry.Environment} | {entry.FeatureName} | {entry.Action} | {entry.UserId} | {entry.Details}");
                    buffer.Clear();
                }
                await Task.Delay(_intervalMs, _cts.Token);
            }
        }

        public void Dispose()
        {
            _cts.Cancel();
            _worker.Wait();
        }
    }
}
