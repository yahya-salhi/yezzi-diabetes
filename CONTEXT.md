# YeZZi Domain Glossary

Terms agreed during Feature 22 design (AI Proxy + Scan Quota). Use this vocabulary in code, docs, and UI copy.

## AI & Proxy

| Term | Definition |
|------|------------|
| **AI scan** | One server-side call that invokes GPT-4o via the proxy — photo vision or text description. Costs 1 quota unit. |
| **Manual log** | User enters nutrition fields directly (food name, carbs, etc.) with no AI. Always free; never blocked by quota. |
| **Proxy** | Cloudflare Worker at `workers/ai-proxy/`. Sole external data boundary. Holds OpenRouter API key; checks quota; forwards to GPT-4o. Photos processed in memory, never stored. |

## Identity & Quota

| Term | Definition |
|------|------------|
| **Device UUID** | Random v4 UUID stored in SecureStore (`device_uuid`). Created on first launch. Sent with every proxy request. Wiped on delete-all. Not linked to personal data. |
| **Free tier** | 10 AI scans per calendar month (UTC). No subscription check in Feature 22 — Plus bypass comes in Feature 23. |
| **Quota period** | Calendar month in UTC. Counter resets to 10 on the 1st of each month. |
| **Quota key** | Cloudflare KV entry: `quota:{device_uuid}:{YYYY-MM}` → integer scan count for that month. |

## API Contract

| Endpoint | Purpose |
|----------|---------|
| `POST /analyze` | AI scan. Body: `{ device_uuid, mode: "photo" \| "text", image_base64?, description? }`. Returns nutrition JSON + quota metadata. Decrements quota only on success. |
| `GET /quota` | Read-only quota sync. Query: `device_uuid`. Returns `{ used, limit, remaining, resets_at }`. |

### Error contract

| Status | Body | Client behavior |
|--------|------|----------------|
| `429` | `{ error: "quota_exhausted", quota: { used, limit, remaining } }` | Warm prompt — "You've used all 10 scans this month. Enter manually or try next month." |
| `502` | `{ error: "ai_service_error" }` | Retry prompt — "Analysis failed, try again." |
| `503` | `{ error: "proxy_unavailable" }` | Retry prompt — "Service unavailable, try again." |

## UX Terms

| Term | Definition |
|------|------------|
| **Describe meal** | Text AI path on ManualEntryScreen — user types a description, taps Analyze. Uses 1 scan. |
| **Skip AI** | Manual log path — user enters nutrition fields without calling the proxy. Free at any quota level. |
