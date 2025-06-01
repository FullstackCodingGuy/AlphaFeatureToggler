
# 🚦 AlphaFeatureToggler

**Feature flag management for every application, with a modern dashboard, targeting, and integration-ready API.**

[![Build, Test, and Publish NuGet Package](https://github.com/FullstackCodingGuy/AlphaFeatureToggler/actions/workflows/ci.yml/badge.svg)](https://github.com/FullstackCodingGuy/AlphaFeatureToggler/actions/workflows/ci.yml)

---

## 🛠️ Built on Microsoft Feature Management

Leverages Microsoft's Feature Management framework as the foundation, while extending it with a robust web UI, audit logging, advanced targeting, and more.

---

## 🎯 Core Capabilities

### 1. 🔁 Feature Flag Management (CRUD)

* Web dashboard and REST API to create, view, update, and delete feature flags.
* Organize flags by project, environment (dev/staging/prod), or application module.

### 2. 🧩 Feature Attributes

* Attach rich metadata: rollout percentage, expiration dates, roles allowed, custom notes, etc.

### 3. 🎯 Targeting & Segmentation

* Enable flags for specific:

  * Users (by ID, email, etc.)
  * Roles, groups, or geographies
  * Custom traits or attributes
* Support for percentage-based rollouts and dynamic rules.

### 4. 🌐 Multi-Environment Configuration

* Isolated configs for dev, staging, and production.
* Promote flag values safely across environments.

### 5. 📜 Audit Logging

* Full trace of all changes: who changed what, when, and how.
* Helpful for debugging and compliance.

### 6. ⚡ Instant Updates

* Real-time (or near real-time) propagation of flag changes across services.
* No redeploys required.

### 7. 🧪 SDK/API Integration

* .NET SDK support (via Microsoft.FeatureManagement).
* REST API for non-.NET environments.

### 8. 🔐 Role-Based Access Control (RBAC)

* User permissions: Admin, Editor, Viewer.

### 9. 🛑 Kill Switch

* One-click flag disable across all environments and services.

---

## 🚀 Extended Capabilities

### 1. 🧠 Custom Targeting Rules

* Define complex conditions (e.g., "users in Canada on mobile who are in beta group").

### 2. 🧪 A/B Testing & Experimentation

* Run experiments natively (requires analytics integration).

### 3. 🔌 Integrations

* Connect with Slack, Jira, GitHub, Datadog, etc., for notifications and workflow automation.

### 4. 📊 Analytics & Usage Tracking

* Capture impressions, usage counts, and behavioral impact.

### 5. ✅ Approval Workflows

* Require approvals for promoting or enabling flags.

### 6. 🏢 Multi-Tenant Support

* Isolate flags and access by client, business unit, or app.

### 7. 📆 Scheduled Rollouts

* Schedule flags to activate/deactivate at specific times.

### 8. 🔐 Self-Service API Keys & Webhooks

* Automate flag changes from CI/CD or external systems.

### 9. 🌍 Internationalization (i18n)

* Multi-language support for flag names, descriptions, and targeting.

---

## 📸 UI Snapshots

### Dashboard

<img width="1262" alt="Create Flag" src="https://github.com/user-attachments/assets/354e1b9f-8f9a-4ec8-bca1-b48c4cfa7588" />

### Creating a Feature Flag

<img width="922" alt="Dashboard" src="https://github.com/user-attachments/assets/d3d6c7f3-6f0b-467f-b52e-336a0c62f602" />

### Rollout Strategy

<img width="865" alt="Rollout Strategy" src="https://github.com/user-attachments/assets/00b60bde-3eee-4804-a6c0-d402eb610fb6" />

### Custom Attributes

<img width="854" alt="Custom Attributes" src="https://github.com/user-attachments/assets/309a1c9c-1783-47b8-b187-7ea803b5ff3d" />

### Configuring Environments

<img width="869" alt="Environment Config" src="https://github.com/user-attachments/assets/47baace0-0d26-4b62-a872-f259e417ff01" />

---

## 💡 Building on Microsoft Feature Management

| Recommendation            | Notes                                                           |
| ------------------------- | --------------------------------------------------------------- |
| **Core Flag Evaluation**  | Use Microsoft.FeatureManagement for core functionality.         |
| **Real-Time Updates**     | Integrate Azure App Configuration with push triggers.           |
| **Advanced Targeting**    | Extend targeting logic in your business layer.                  |
| **RBAC & Audit**          | Implement access control and history tracking at the app level. |
| **Analytics/Experiments** | Build these features using custom or third-party services.      |

---

## 📋 Feature Support Matrix

| Feature                       | Priority | MS Feature Mgmt Support | Custom Implementation |
| ----------------------------- | -------- | ----------------------- | --------------------- |
| Feature Flag CRUD             | ⭐ Core   | ✅                       | Minimal               |
| Feature Attributes            | ⭐ Core   | ❌                       | ✅                     |
| Targeting/Segmentation        | ⭐ Core   | ✅ (Basic)               | ✅ (Advanced)          |
| Multi-Environment             | ⭐ Core   | ✅                       | Minimal               |
| Audit Logging                 | ⭐ Core   | ❌                       | ✅                     |
| Instant Updates               | ⭐ Core   | ✅ (w/ Azure App Config) | Minimal               |
| SDK/API Integration           | ⭐ Core   | ✅ (.NET SDK only)       | ✅ (REST for others)   |
| Role-Based Access Control     | ⭐ Core   | ❌                       | ✅                     |
| Flag Status / Kill Switch     | ⭐ Core   | ✅                       | Minimal               |
| Custom Targeting Rules        | ⭐⭐ Extra | ❌                       | ✅                     |
| A/B Testing / Experimentation | ⭐⭐ Extra | ❌                       | ✅                     |
| Analytics & Usage Tracking    | ⭐⭐ Extra | ❌                       | ✅                     |
| External Integrations         | ⭐⭐ Extra | ❌                       | ✅                     |
| Approval Workflows            | ⭐⭐ Extra | ❌                       | ✅                     |
| Multi-Tenant Isolation        | ⭐⭐ Extra | ❌                       | ✅                     |
| Caching & Performance         | ⭐ Core   | ❌                       | ✅                     |
| Change Propagation            | ⭐ Core   | ❌                       | ✅                     |
| Promotion Workflows           | ⭐ Core   | ❌                       | ✅                     |

---

## 🗂️ Project Status Overview

| Area               | Description                                              | Status         | Notes                         |
| ------------------ | -------------------------------------------------------- | -------------- | ----------------------------- |
| UI/UX              | Dashboard for flag CRUD, search, filters, and attributes | 🟡 In Progress | Wireframes/design in progress |
| API                | REST endpoints for flag operations                       | ⬜ Not Started  | Endpoint structure pending    |
| Targeting          | Enable/disable by traits, groups, %, env                 | 🟡 In Progress | Core logic under dev          |
| Audit Logging      | Log every change with metadata                           | 🟡 In Progress | Storage backend to finalize   |
| Access Control     | Role-based user permissions                              | ⬜ Not Started  | Auth integration pending      |
| Real-Time Updates  | Flag updates without service restart                     | 🟡 In Progress | Azure App Config integration  |
| Kill Switch        | Immediate deactivation toggle                            | ✅ Complete     | Fully functional              |
| Promotion Workflow | Dev → Staging → Prod with optional approvals             | 🟡 In Progress | Flow needs definition         |
| Flag Documentation | Add descriptions, tags, owner info                       | ⬜ Not Started  | UI/API changes required       |
| Automated Testing  | Unit + Integration for core modules                      | 🟡 In Progress | CI setup ongoing              |
