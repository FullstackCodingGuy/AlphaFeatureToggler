using Microsoft.FeatureManagement;
using System.Collections.Concurrent;

namespace AlphaFeatureToggler.Integration
{
    public class InMemoryFeatureManager : IFeatureManager
    {
        private readonly ConcurrentDictionary<string, (bool Enabled, Dictionary<string, object>? Attributes)> _features = new();
        public void SetFeature(string name, bool enabled, Dictionary<string, object>? attributes = null) => _features[name] = (enabled, attributes);
        public Task<bool> IsEnabledAsync(string feature) => Task.FromResult(_features.TryGetValue(feature, out var v) && v.Enabled);
        public IAsyncEnumerable<string> GetFeatureNamesAsync() => GetNames();
        public Task<bool> IsEnabledAsync<TContext>(string feature, TContext context) => IsEnabledAsync(feature);
        public Dictionary<string, object>? GetAttributes(string feature) => _features.TryGetValue(feature, out var v) ? v.Attributes : null;
        private async IAsyncEnumerable<string> GetNames() { foreach (var k in _features.Keys) yield return k; await Task.CompletedTask; }
    }
}