using AlphaFeatureToggler.Core;
using AlphaFeatureToggler.Integration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.FeatureManagement;
using System;

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
            services.AddSingleton<Microsoft.FeatureManagement.IFeatureManager, InMemoryFeatureManager>();
            services.AddSingleton<IFeatureToggleService, FeatureToggleService>();
            if (configureOptions != null)
                services.Configure(configureOptions);
            return services;
        }
    }
}
