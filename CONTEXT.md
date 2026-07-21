# YeZZi Domain Glossary

Use this vocabulary in code, docs, and UI copy. These terms cover the AI proxy,
scan quota, and YeZZi Plus subscription boundary.

## AI & Proxy

| Term | Definition |
|------|------------|
| **AI scan** | One server-side call that invokes GPT-4o through the proxy, either photo vision or text description. Costs 1 quota unit for free users. |
| **Manual log** | User enters nutrition fields directly, with no AI call. Always free and never blocked by quota or paywall. |
| **Proxy** | Cloudflare Worker at `workers/ai-proxy/`. The sole external AI data boundary. Holds the OpenRouter API key, checks free-user quota, and forwards to GPT-4o. Photos are processed in memory and never stored. |

## Identity & Quota

| Term | Definition |
|------|------------|
| **Device UUID** | Random v4 UUID stored in SecureStore under `device_uuid`. Created on first launch. Sent with every proxy request. Wiped on delete-all. Not linked to personal data. |
| **Free tier** | Core app access with 10 AI scans per UTC calendar month. Manual logs, glucose tracking, CSV export, backup, and restore remain free. |
| **Quota period** | Calendar month in UTC. Counter resets on the 1st of each month. |
| **Quota key** | Cloudflare KV entry: `quota:{device_uuid}:{YYYY-MM}` -> integer scan count for that month. |
| **Quota exhausted** | Free user has 0 AI scans remaining for the current quota period. The user must be offered two clear choices: upgrade to YeZZi Plus or enter manually. |

## YeZZi Plus

| Term | Definition |
|------|------------|
| **YeZZi Plus** | Paid subscription that unlocks unlimited AI scans and PDF doctor reports. Future premium insights may be added later. |
| **Entitlement** | RevenueCat entitlement key `is_plus`. Active means the user is treated as Plus. Inactive means the user is treated as free tier. |
| **Monthly product** | Google Play subscription product ID `yezzi_plus_monthly`, priced at $2.99/month at launch. |
| **Yearly product** | Google Play subscription product ID `yezzi_plus_yearly`, priced at $19.99/year at launch. |
| **Purchase truth** | RevenueCat is the on-device source of purchase truth for v1. The app reads customer info and derives `is_plus` from the active entitlement. |
| **Restore purchases** | Settings action that calls RevenueCat restore and refreshes entitlement state. |
| **Cancellation** | When RevenueCat reports `is_plus` inactive, the app immediately returns to free-tier behavior: AI scans use remaining monthly quota, and PDF doctor reports are gated again. Existing local data and exported files remain untouched. |

## Paywall UX

| Term | Definition |
|------|------------|
| **Paywall** | Subscription screen shown only at natural gated moments, never at launch. |
| **Natural gated moment** | A moment where the user tries to use a Plus benefit: AI scan at 0 free scans, or PDF doctor report export as a free user. |
| **Settings Plus row** | Visible Settings row for YeZZi Plus status and upgrade/management access. This is allowed even before a gated action because Settings is an expected account/purchase management surface. |
| **Upgrade choice** | Primary action offered when quota is exhausted. Opens the paywall. |
| **Enter manually choice** | Secondary action offered when quota is exhausted. Keeps the user in the free manual logging path. |
| **Plus quota line** | Replacement for the free quota indicator when `is_plus` is active. Copy should communicate unlimited AI scans quietly instead of showing a remaining count. |

## API Contract

| Endpoint | Purpose |
|----------|---------|
| `POST /analyze` | AI scan. Body includes `{ device_uuid, mode: "photo" | "text", is_plus, image_base64?, description? }`. Returns nutrition JSON plus quota metadata for free users. Skips quota check and increment when `is_plus === true`. |
| `GET /quota` | Read-only quota sync. Query: `device_uuid`. Returns `{ used, limit, remaining, resets_at }` for free-tier display. |

### Error contract

| Status | Body | Client behavior |
|--------|------|-----------------|
| `429` | `{ error: "quota_exhausted", quota: { used, limit, remaining } }` | Offer "Upgrade" and "Enter manually". Never block manual logging. |
| `502` | `{ error: "ai_service_error" }` | Retry prompt: "Analysis failed, try again." |
| `503` | `{ error: "proxy_unavailable" }` | Retry prompt: "Service unavailable, try again." |

## Trust & Privacy

| Term | Definition |
|------|------------|
| **Client-trusted Plus** | v1 proxy model where the app sends `is_plus` and the Worker trusts it. Server-side RevenueCat validation is deferred until post-launch. |
| **Server-side validation** | Future hardening where the proxy validates RevenueCat entitlement server-side before bypassing quota. Deferred for v1. |
| **Purchase state** | Subscription state handled by RevenueCat and Google Play. It may leave the device as part of purchase infrastructure. |
| **Health data boundary** | Glucose logs, meals, backups, CSV/PDF exports, and settings stay local. They are not sent to RevenueCat. Meal photos leave the device only for AI analysis through the proxy. |

## UX Terms

| Term | Definition |
|------|------------|
| **Describe meal** | Text AI path on ManualEntryScreen. User types a description and taps Analyze. Uses 1 scan for free users, unlimited for Plus users. |
| **Skip AI** | Manual log path. User enters nutrition fields without calling the proxy. Free at any quota level. |
| **PDF doctor report** | Plus-gated formatted PDF export for care-team review. CSV export remains free. |
