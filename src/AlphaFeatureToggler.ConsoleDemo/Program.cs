using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AlphaFeatureToggler.Core;
using AlphaFeatureToggler.Integration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.Collections.Concurrent;
using Microsoft.FeatureManagement;
using AlphaFeatureToggler;

namespace AlphaFeatureToggler.ConsoleDemo
{
    public enum UserRole { Admin, Manager, Developer, Guest }

    public class User
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public UserRole Role { get; set; }
    }

    class Program
    {
        static async Task Main(string[] args)
        {
            // Setup DI
            var services = new ServiceCollection();
            services.AddAlphaFeatureToggler(opt => {
                opt.Environment = FeatureEnvironment.Development;
                opt.EnableCaching = true;
                opt.FeatureCacheSeconds = 10;
                opt.Features = new List<FeatureConfig>
                {
                    new FeatureConfig 
                    { 
                        Name = "PremiumFeature",
                        Enabled = true,
                        Attributes = new Dictionary<string, object>
                        {
                            { "MinimumUserTier", "Premium" },
                            { "RolloutPercentage", 25 }
                        }
                    },
                    new FeatureConfig
                    {
                        Name = "BetaFeature",
                        Enabled = true,
                        Attributes = new Dictionary<string, object>
                        {
                            { "AllowedRoles", new[] { "Admin", "Developer" } },
                            { "ExpirationDate", "2024-12-31" }
                        }
                    }
                };
            });
            var provider = services.BuildServiceProvider();
            var toggler = (FeatureToggleService)provider.GetRequiredService<IFeatureToggleService>();
            var featureManager = (InMemoryFeatureManager)provider.GetRequiredService<Microsoft.FeatureManagement.IFeatureManager>();

            // Demo users
            var users = new List<User>
            {
                new User { Id = "1", Name = "Alice", Role = UserRole.Admin },
                new User { Id = "2", Name = "Bob", Role = UserRole.Manager },
                new User { Id = "3", Name = "Carol", Role = UserRole.Developer },
                new User { Id = "4", Name = "Dave", Role = UserRole.Guest }
            };

            // Enterprise use cases
            featureManager.SetFeature("AdvancedReporting", true);
            featureManager.SetFeature("BetaDashboard", false);

            Console.WriteLine("--- Feature Access Demo ---");
            foreach (var user in users)
            {
                bool canAccess = await toggler.IsEnabledAsync("AdvancedReporting");
                Console.WriteLine($"User {user.Name} ({user.Role}) can access AdvancedReporting: {canAccess}");
            }

            Console.WriteLine("\n--- Enable/Disable Demo ---");
            featureManager.SetFeature("BetaDashboard", true);
            Console.WriteLine($"BetaDashboard enabled: {await toggler.IsEnabledAsync("BetaDashboard")}");
            featureManager.SetFeature("BetaDashboard", false);
            toggler.ClearFeatureCache(); // Propagate change
            Console.WriteLine($"BetaDashboard after disable: {await toggler.IsEnabledAsync("BetaDashboard")}");

            Console.WriteLine("\n--- Kill Switch Demo ---");
            await toggler.ActivateKillSwitchAsync("AdvancedReporting", FeatureEnvironment.Development, "Critical bug", users[0].Id);
            Console.WriteLine($"AdvancedReporting after kill switch: {await toggler.IsEnabledAsync("AdvancedReporting")}");
            await toggler.DeactivateKillSwitchAsync("AdvancedReporting", FeatureEnvironment.Development, users[0].Id);
            toggler.ClearFeatureCache();
            Console.WriteLine($"AdvancedReporting after kill switch deactivation: {await toggler.IsEnabledAsync("AdvancedReporting")}");

            Console.WriteLine("\n--- Caching Demo ---");
            featureManager.SetFeature("CacheTest", true);
            var t1 = DateTime.Now;
            for (int i = 0; i < 5; i++)
                await toggler.IsEnabledAsync("CacheTest");
            var t2 = DateTime.Now;
            Console.WriteLine($"First batch (cache miss): {(t2-t1).TotalMilliseconds} ms");
            toggler.ClearFeatureCache();
            var t3 = DateTime.Now;
            for (int i = 0; i < 5; i++)
                await toggler.IsEnabledAsync("CacheTest");
            var t4 = DateTime.Now;
            Console.WriteLine($"Second batch (cache miss after clear): {(t4-t3).TotalMilliseconds} ms");

            Console.WriteLine("\n--- Change Propagation Demo ---");
            featureManager.SetFeature("LiveUpdate", false);
            toggler.ClearFeatureCache();
            Console.WriteLine($"LiveUpdate before propagation: {await toggler.IsEnabledAsync("LiveUpdate")}");
            featureManager.SetFeature("LiveUpdate", true);
            toggler.ClearFeatureCache();
            Console.WriteLine($"LiveUpdate after propagation: {await toggler.IsEnabledAsync("LiveUpdate")}");

            Console.WriteLine("\n--- Feature Attributes Demo ---");
            
            // Demonstrate PremiumFeature attributes
            var premiumAttrs = toggler.GetFeatureAttributes("PremiumFeature");
            Console.WriteLine("PremiumFeature Attributes:");
            Console.WriteLine($"Minimum Tier: {premiumAttrs?["MinimumUserTier"]}");
            Console.WriteLine($"Rollout Percentage: {premiumAttrs?["RolloutPercentage"]}%");

            // Demonstrate BetaFeature attributes
            var betaAttrs = toggler.GetFeatureAttributes("BetaFeature");
            Console.WriteLine("\nBetaFeature Attributes:");
            var allowedRoles = betaAttrs?["AllowedRoles"] as string[];
            Console.WriteLine($"Allowed Roles: {string.Join(", ", allowedRoles ?? Array.Empty<string>())}");
            Console.WriteLine($"Expiration Date: {betaAttrs?["ExpirationDate"]}");

            // Example of using attributes for access control
            foreach (var user in users)
            {
                bool canAccessBeta = await toggler.IsEnabledAsync("BetaFeature") && 
                    allowedRoles?.Contains(user.Role.ToString()) == true;
                Console.WriteLine($"\nUser {user.Name} ({user.Role}) can access BetaFeature: {canAccessBeta}");
            }

            Console.WriteLine("\n--- Audit Log is batched and offloaded (see debug output) ---");
            await Task.Delay(2000); // Allow audit logger to flush
        }
    }
}
