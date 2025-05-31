using AlphaFeatureToggler.Core;
using AlphaFeatureToggler.Integration;
using Microsoft.Extensions.DependencyInjection;

namespace AlphaFeatureToggler
{
    public static class FeatureTogglerServiceCollectionExtensions
    {
        public static IServiceCollection AddAlphaFeatureToggler(
            this IServiceCollection services,
            Action<FeatureToggleServiceOptions>? configureOptions = null,
            int auditBatchSize = 5,
            int auditIntervalMs = 1000)
        {
            services.AddSingleton<IFeatureAuditLogger>(_ => new BatchingFeatureAuditLogger(batchSize: auditBatchSize, intervalMs: auditIntervalMs));
            services.AddSingleton<IFeatureChangePropagator, InMemoryFeatureChangePropagator>();
            services.AddSingleton<IFeaturePromotionWorkflow, InMemoryFeaturePromotionWorkflow>();
            services.AddSingleton<IFeatureApiIntegration, InMemoryFeatureApiIntegration>();
            services.AddSingleton<Microsoft.FeatureManagement.IFeatureManager, InMemoryFeatureManager>(sp =>
            {
                var options = new FeatureToggleServiceOptions();
                configureOptions?.Invoke(options);
                var mgr = new InMemoryFeatureManager();
                if (options.Features != null)
                {
                    foreach (var f in options.Features)
                        mgr.SetFeature(f.Name, f.Enabled, f.Attributes);
                }
                return mgr;
            });
            services.AddSingleton<IFeatureToggleService, FeatureToggleService>();
            if (configureOptions != null)
                services.Configure(configureOptions);
            return services;
        }
    }
}
