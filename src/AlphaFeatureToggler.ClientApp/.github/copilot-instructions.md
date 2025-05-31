<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a React + TypeScript + Vite + MUI SaaS dashboard for feature flag management. Use best practices for multi-tenant SaaS, authentication, and feature CRUD. Use React Router v6 for routing. Use MUI for all UI components.

Implement login, signup, authenticated and unauthenticated routes, feature configuration CRUD, and a dashboard page for overall progress.

Implementing a **feature kill switch with progressive rollout logic** involves building a mechanism that allows you to **safely enable or disable features for specific user groups or percentages**. Below is a clear **specification and goal-driven approach** to define and implement this logic.

---

## ✅ **Feature Kill Switch with Progressive Rollout – Specification**

### 🎯 **Goals**

1. **Toggle features on/off instantly (kill switch)** for emergencies.
2. **Gradually roll out a feature** to a percentage of users to mitigate risk (canary deployments).
3. **Target specific user segments** (e.g., internal users, premium users).
4. **Ensure rollout is deterministic per user** (same user always sees the same variation).
5. **Support rollback** or kill switch at any stage of rollout.

---

## 📐 **Specification**

### 1. **Feature Flag Metadata**

* `flag_key`: Unique key for the feature flag.
* `enabled`: Boolean – global flag switch.
* `targeting_rules`: List of rules to include/exclude users.
* `rollout_percentage`: Integer – 0–100% for progressive rollout.
* `kill_switch`: Boolean – if true, disables feature globally regardless of other rules.

### 2. **User Context**

Each flag evaluation requires a `User` object:

```json
{
  "user_id": "user_123",
  "email": "user@example.com",
  "segment": "beta",
  "is_internal": true
}
```

### 3. **Evaluation Logic**

```pseudo
function isFeatureEnabled(flag, user):
    if flag.kill_switch:
        return false

    if not flag.enabled:
        return false

    if user matches any flag.targeting_rules.allow_list:
        return true

    if user matches any flag.targeting_rules.deny_list:
        return false

    if rollout_percentage is defined:
        hash = SHA256(user.user_id + flag.flag_key)
        bucket = hash % 100
        return bucket < rollout_percentage

    return false
```

---

## 🧪 **Progressive Rollout Logic (Deterministic Bucketing)**

```ts
function getBucketValue(userId: string, flagKey: string): number {
  const hash = sha256(userId + flagKey);  // deterministic
  return parseInt(hash.substring(0, 8), 16) % 100;  // 0–99
}
```

* This ensures the **same user always falls into the same bucket**, making the rollout stable.

---

## 📦 **Example Configuration (JSON)**

```json
{
  "flag_key": "new_search_ui",
  "enabled": true,
  "kill_switch": false,
  "rollout_percentage": 20,
  "targeting_rules": {
    "allow_list": [
      { "attribute": "email", "operator": "endsWith", "value": "@internal.com" }
    ],
    "deny_list": [
      { "attribute": "segment", "operator": "equals", "value": "legacy" }
    ]
  }
}
```

---

## 🚨 **Kill Switch Behavior**

* Setting `kill_switch: true` overrides **everything** (even allow\_list).
* Use it for:

  * Hotfix rollbacks
  * Outage mitigation
  * Emergency disablement

---

## 📈 **Goals to Achieve**

| Goal                           | Mechanism                                                             |
| ------------------------------ | --------------------------------------------------------------------- |
| Instantly disable feature      | `kill_switch: true`                                                   |
| Roll out to 10% of users       | `rollout_percentage: 10`                                              |
| Target internal users only     | `targeting_rules.allow_list`                                          |
| Exclude specific user segments | `targeting_rules.deny_list`                                           |
| Maintain consistency           | Deterministic bucketing by `user_id`                                  |
| Safe rollback                  | Change `enabled` or `rollout_percentage` via config or flag dashboard |

---

## 🛠️ **Where to Store Flags**

Options:

* Use a **feature flag service** (e.g., LaunchDarkly, Unleash, Flipt).
* Or a **JSON-based config file or database**, cached and refreshed periodically.

---

## 🔄 **Rollout Plan Example**

| Timeframe | Action                    |
| --------- | ------------------------- |
| T0        | Enable for internal users |
| T+1 day   | Roll out to 10% of users  |
| T+2 days  | Increase to 30%           |
| T+3 days  | Full rollout              |
| On error  | Set `kill_switch: true`   |

---

Would you like a working sample of this in TypeScript, Python, or as a microservice with REST API?
## 🚀 **Implementation Steps**
1. **Define Feature Flag Model**: Create a model/schema for feature flags with the necessary fields.
2. **Implement Evaluation Logic**: Write the logic to evaluate if a feature is enabled based on the user context and flag configuration.
3. **Create API Endpoints**: Build RESTful endpoints to manage feature flags (CRUD operations).
4. **Integrate with Frontend**: Use the evaluation logic in your React components to conditionally render features.
5. **Testing**: Write unit tests for the evaluation logic and integration tests for the API endpoints.
6. **Documentation**: Document the API and usage guidelines for developers.
7. **Deployment**: Deploy the service and ensure it can be accessed by your frontend application.
8. **Monitoring & Logging**: Implement logging and monitoring to track feature usage and performance.
9. **User Interface**: Build a dashboard for managing feature flags, including the ability to toggle flags, set rollout percentages, and view logs.
10. **Feedback Loop**: Collect feedback from users and developers to improve the feature management system.
## 📝 **Documentation and Best Practices**
- **Document the API**: Use tools like Swagger or Postman to document your API endpoints.
- **Best Practices**: Follow best practices for feature flag management, such as keeping flags small and focused, removing old flags regularly, and ensuring flags are not used for long-term configuration.
- **Version Control**: Use version control for your feature flag configurations to track changes over time.
- **Security**: Ensure that sensitive feature flags are protected and only accessible to authorized users.
- **Testing**: Implement thorough testing for both the backend logic and frontend integration to ensure reliability.
- **User Education**: Provide clear guidelines for developers on how to use feature flags effectively in their applications.
- **Performance Considerations**: Optimize the evaluation logic to minimize performance impact, especially for high-traffic applications.
- **Analytics**: Consider integrating analytics to track feature usage and impact on user behavior.
- **Feedback Mechanism**: Implement a way for users to provide feedback on new features, which can help in making decisions about future rollouts or rollbacks.
- **Progressive Rollout Strategy**: Define a clear strategy for progressive rollouts, including how to handle failures and rollbacks.
- **Monitoring and Alerts**: Set up monitoring and alerts for feature flag changes to quickly respond to any issues that arise during rollouts.
- **Compliance and Auditing**: Ensure that feature flag changes are logged for compliance and auditing purposes, especially in regulated industries.
- **Training and Onboarding**: Provide training sessions or materials for new developers to understand how to use the feature flag system effectively.
- **Community and Support**: Engage with the developer community for feedback and support, and consider open-sourcing the feature flag management system if it aligns with your goals.
- **Scalability**: Design the system to handle a growing number of feature flags and user segments without performance degradation.
- **Fallback Mechanism**: Implement a fallback mechanism to ensure that if a feature flag evaluation fails, the system defaults to a safe state (e.g., feature disabled).
- **User Segmentation**: Consider implementing advanced user segmentation capabilities to allow for more granular control over feature rollouts.
- **Documentation**: Maintain comprehensive documentation for both developers and end-users to understand how to use the feature management system effectively.



