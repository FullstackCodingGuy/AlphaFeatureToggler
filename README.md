# AlphaFeatureToggler

A feature toggle for every application.


[![Build, Test, and Publish NuGet Package](https://github.com/FullstackCodingGuy/AlphaFeatureToggler/actions/workflows/ci.yml/badge.svg)](https://github.com/FullstackCodingGuy/AlphaFeatureToggler/actions/workflows/ci.yml)



## 🛠️ Building Feature Management Tool (with Microsoft Feature Management as Backend)

## 🎯 **Primary Features**

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

## 🚀 **Secondary Features**

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



**Dashboard**

<img width="922" alt="image" src="https://github.com/user-attachments/assets/d3d6c7f3-6f0b-467f-b52e-336a0c62f602" />

**Creating new feature flag**

<img width="1262" alt="image" src="https://github.com/user-attachments/assets/354e1b9f-8f9a-4ec8-bca1-b48c4cfa7588" />

**Rollout Strategy**

<img width="865" alt="image" src="https://github.com/user-attachments/assets/00b60bde-3eee-4804-a6c0-d402eb610fb6" />

**Custom Attributes**

<img width="854" alt="image" src="https://github.com/user-attachments/assets/309a1c9c-1783-47b8-b187-7ea803b5ff3d" />

**Configuring Environment**

<img width="869" alt="image" src="https://github.com/user-attachments/assets/47baace0-0d26-4b62-a872-f259e417ff01" />


---

## 💡 **Recommendations for Building with Microsoft Feature Management**

- **Primary Features:** Microsoft Feature Management supports core flag evaluation, targeting, and integration with .NET apps. Build your UI, API, and audit layers on top of this.
- **Real-Time Updates:** Use Azure App Configuration with push notifications/event triggers for instant flag changes.
- **Extend Targeting:** Add user segmentation and advanced rules in your business logic/UI layer.
- **Security:** Implement RBAC and audit logging at your application level.
- **Secondary Features:** Add analytics, integrations, and experimentation as your user base grows.

---

## 📋 **Updated Summary Table**

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
| Caching                      | Primary     | ❌                           | Yes                         |
| Change Propagation           | Primary     | ❌                           | Yes                         |
| Promotion Workflow           | Primary     | ❌                           | Yes                         |

---

## 🚩 **Updated Project Overview**

| Area                | Description                                                                                 | Status        | Owner   | Notes                       |
|---------------------|--------------------------------------------------------------------------------------------|--------------|---------|-----------------------------|
| UI/UX               | Feature flag dashboard for CRUD, search, filter, and flag details                          | 🟡 In Progress|         | Wireframes needed           |
| API                 | REST API for programmatic flag management                                                  | ⬜ Not Started|         | Define endpoints            |
| Targeting           | Enable/disable flags globally, by environment, user, group, or percentage                  | 🟡 In Progress|         | Percentage rollout logic    |
| Audit Logging       | Full change history: who, what, when for all flag edits                                    | 🟡 In Progress|         | Choose log storage          |
| Access Control      | RBAC: admin, editor, viewer roles for managing flags                                       | ⬜ Not Started|         | Integrate with auth system  |
| Change Propagation  | Instant/near-real-time rollout of flag changes across services                             | 🟡 In Progress|         | Use Azure AppConfig, polling|
| Kill Switch         | Instantly disable any flag across all environments                                         | 🟢 Complete   |         | UI button + API endpoint    |
| Promotion Workflow  | Safely promote flag settings between environments (dev → staging → prod)                   | 🟡 In Progress|         | Approval step optional      |
| Documentation       | Inline flag descriptions, owner, tags for each flag                                        | ⬜ Not Started|         | UI fields + API support     |
| Testing             | Unit/integration tests for CRUD, targeting, kill switch, and audit logging                 | 🟡 In Progress|         | CI/CD coverage              |

---
