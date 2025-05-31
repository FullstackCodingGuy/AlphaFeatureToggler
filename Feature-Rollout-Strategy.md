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
