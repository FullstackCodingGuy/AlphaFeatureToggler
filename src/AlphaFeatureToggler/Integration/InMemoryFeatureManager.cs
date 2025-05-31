using Microsoft.FeatureManagement;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AlphaFeatureToggler.Integration
{
    public class InMemoryFeatureManager : IFeatureManager
    {
        private readonly ConcurrentDictionary<string, bool> _features = new();
        public void SetFeature(string name, bool enabled) => _features[name] = enabled;
        public Task<bool> IsEnabledAsync(string feature) => Task.FromResult(_features.TryGetValue(feature, out var v) && v);
        public IAsyncEnumerable<string> GetFeatureNamesAsync() => GetNames();
        public Task<bool> IsEnabledAsync<TContext>(string feature, TContext context) => IsEnabledAsync(feature);
        private async IAsyncEnumerable<string> GetNames() { foreach (var k in _features.Keys) yield return k; await Task.CompletedTask; }
    }
}