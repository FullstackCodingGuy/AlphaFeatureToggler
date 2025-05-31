# AlphaFeatureToggler

A feature toggle for every application.


[![Build, Test, and Publish NuGet Package](https://github.com/FullstackCodingGuy/AlphaFeatureToggler/actions/workflows/ci.yml/badge.svg)](https://github.com/FullstackCodingGuy/AlphaFeatureToggler/actions/workflows/ci.yml)

## 🛠️ Building Feature Management Tool (with Microsoft Feature Management as Backend)

## 🎯 **Primary (Must-Have) Features**

1. **Feature Flag CRUD (Create, Read, Update, Delete)**
   - Web UI and API for managing feature flags.
   - Ability to organize flags by project/application/environment.
2. **Feature Attributes**
   - Attach custom metadata (e.g., rollout %, allowed roles, expiration) to each feature flag for advanced scenarios.
3. **Targeting & Segmentation**
   - Enable/disable flags for specific users, groups, or attributes (e.g., by user ID, role, region).
   - Support for percentage-based rollouts (e.g., enable for 10% of users).
   - Feature-specific attributes for fine-grained control (e.g., minimum user tier, expiration dates).

4. **Multi-Environment Support**
   - Separate configuration for dev, staging, and production.
   - Promote flag values/settings between environments.

5. **Audit Logging & Change History**
   - Track who changed what and when for compliance and debugging.

6. **Instant Flag Updates**
   - Real-time (or near real-time) flag changes that take effect across services without redeploy.

7. **SDK/API Integration**
   - SDKs or REST API endpoints for your apps/services to evaluate flags dynamically.

8. **User Access Controls**
   - Basic roles/permissions (e.g., admin, editor, viewer) for flag management.

9. **Flag Status & Kill Switch**
   - Easy way to view all current flag statuses and instantly disable (kill switch) a flag across the system.

---

## 🚀 **Secondary (Nice-to-Have/Advanced) Features**

1. **Custom Targeting Rules**
   - Complex conditions: combinations of user traits, geo, device, etc.

2. **A/B Testing & Experimentation**
   - Native support for running experiments and measuring results (may require additional analytics integration).

3. **Integrations**
   - Connect with Slack, Jira, GitHub, Datadog, etc., for notifications and workflow automations.

4. **Analytics & Usage Tracking**
   - Track flag usage, impressions, and impact on user behavior or system performance.

5. **Approval Workflows**
   - Flag changes can require review/approval before going live.

6. **Multi-Tenancy Support**
   - Ability to separate flags and access for different business units or clients.

7. **Scheduled Rollouts**
   - Schedule flag changes for specific times or windows.

8. **Self-Service API Keys & Webhooks**
   - For automation and integration with CI/CD pipelines and external systems.

9. **Localization/Internationalization**
   - Support for multi-language flag names, descriptions, and targeting.

---

## 💡 **Recommendations for Building with Microsoft Feature Management**

- **Primary Features:** Microsoft Feature Management supports core flag evaluation, targeting, and integration with .NET apps. Build your UI, API, and audit layers on top of this.
- **Real-Time Updates:** Use Azure App Configuration with push notifications/event triggers for instant flag changes.
- **Extend Targeting:** Add user segmentation and advanced rules in your business logic/UI layer.
- **Security:** Implement RBAC and audit logging at your application level.
- **Secondary Features:** Add analytics, integrations, and experimentation as your user base grows.

---

## 📋 **Summary Table**

| Feature                      | Priority    | Supported by MS Feature Mgmt | Custom Implementation Needed |
|------------------------------|-------------|------------------------------|-----------------------------|
| Feature Flag CRUD            | Primary     | ✔️                           | Minimal                     |
| Feature Attributes           | Primary     | ❌                           | Yes                         |
| Targeting/Segmentation       | Primary     | ✔️ (basic)                   | For advanced rules          |
| Multi-Environment            | Primary     | ✔️                           | Minimal                     |
| Audit Logging                | Primary     | ❌                           | Yes                         |
| Instant Updates              | Primary     | ✔️ (with Azure App Config)   | Minimal                     |
| SDK/API Integration          | Primary     | ✔️ (.NET SDK)                | For non-.NET languages      |
| Roles/Permissions            | Primary     | ❌                           | Yes                         |
| Flag Status/Kill Switch      | Primary     | ✔️                           | Minimal                     |
| Custom Targeting Rules       | Secondary   | ❌                           | Yes                         |
| A/B Testing/Experimentation  | Secondary   | ❌                           | Yes                         |
| Analytics/Usage Tracking     | Secondary   | ❌                           | Yes                         |
| Integrations                 | Secondary   | ❌                           | Yes                         |
| Approval Workflows           | Secondary   | ❌                           | Yes                         |
| Multi-Tenancy                | Secondary   | ❌                           | Yes                         |

---




# 🚩 Feature Flag Management Core Capabilities – Project Plan

This project plan focuses on building a user-friendly, auditable, and safe feature flag management system, using Microsoft Feature Management as the backend (or a similar provider).

---

## Project Overview

| Area                | Description                                                                                 | Status        | Owner   | Notes                       |
|---------------------|--------------------------------------------------------------------------------------------|--------------|---------|-----------------------------|
| UI/UX               | Feature flag dashboard for CRUD, search, filter, and flag details                          | ⬜ Not Started|         | Wireframes needed           |
| API                 | REST API for programmatic flag management                                                  | ⬜ Not Started|         | Define endpoints            |
| Targeting           | Enable/disable flags globally, by environment, user, group, or percentage                  | ⬜ Not Started|         | Percentage rollout logic    |
| Audit Logging       | Full change history: who, what, when for all flag edits                                    | ⬜ Not Started|         | Choose log storage          |
| Access Control      | RBAC: admin, editor, viewer roles for managing flags                                       | ⬜ Not Started|         | Integrate with auth system  |
| Change Propagation  | Instant/near-real-time rollout of flag changes across services                             | ⬜ Not Started|         | Use Azure AppConfig, polling|
| Kill Switch         | Instantly disable any flag across all environments                                         | ⬜ Not Started|         | UI button + API endpoint    |
| Promotion Workflow  | Safely promote flag settings between environments (dev → staging → prod)                   | ⬜ Not Started|         | Approval step optional      |
| Documentation       | Inline flag descriptions, owner, tags for each flag                                        | ⬜ Not Started|         | UI fields + API support     |
| Testing             | Unit/integration tests for CRUD, targeting, kill switch, and audit logging                 | ⬜ Not Started|         | CI/CD coverage              |

---

## Milestones

### 1. **Initial Setup**
- [ ] Project repo, dev environment, and CI/CD pipeline
- [ ] Integrate Microsoft Feature Management backend

### 2. **Feature Flag Management UI & API**
- [ ] Design and implement dashboard
- [ ] Implement REST API for flags
- [ ] Add metadata (descriptions, owners, tags)

### 3. **Targeting & Segmentation**
- [ ] Global and environment-based toggling
- [ ] User/group/role-based targeting
- [ ] Percentage rollout (canary releases)

### 4. **Auditability**
- [ ] Change log schema and storage
- [ ] Display flag change history in UI
- [ ] Export/download audit logs

### 5. **Access Control**
- [ ] Role-based access (admin, editor, viewer)
- [ ] Integrate with authentication system

### 6. **Safe Rollout Features**
- [ ] Real-time/instant flag update propagation
- [ ] Implement kill switch (UI + API)
- [ ] Promotion workflow (move flags between environments)

### 7. **Testing & Validation**
- [ ] Unit tests for all components
- [ ] Integration tests for API/UI/propagation
- [ ] User acceptance testing

### 8. **Documentation & Training**
- [ ] User guide and onboarding docs
- [ ] Inline help and flag documentation

---

## Status Key

- ⬜ Not Started
- 🟡 In Progress
- 🟢 Complete

---

## 📝 Feature Attributes Example

You can define features with attributes in your DI setup:

```csharp
services.AddAlphaFeatureToggler(opt => {
    opt.Features = new List<FeatureConfig>
    {
        new FeatureConfig {
            Name = "PremiumFeature",
            Enabled = true,
            Attributes = new Dictionary<string, object> {
                { "MinimumUserTier", "Premium" },
                { "RolloutPercentage", 25 }
            }
        },
        new FeatureConfig {
            Name = "BetaFeature",
            Enabled = true,
            Attributes = new Dictionary<string, object> {
                { "AllowedRoles", new[] { "Admin", "Developer" } },
                { "ExpirationDate", "2024-12-31" }
            }
        }
    };
});
```

Retrieve and use attributes at runtime:

```csharp
var attrs = toggler.GetFeatureAttributes("PremiumFeature");
if (attrs?["MinimumUserTier"] as string == "Premium")
{
    // Enable premium feature for this user
}
```
