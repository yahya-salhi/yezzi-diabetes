# ADR 0001: AI Proxy + Scan Quota Architecture

**Status:** Accepted  
**Date:** 2026-07-16  
**Feature:** 22 — AI Proxy + Scan Quota

## Context

YeZZi currently calls OpenRouter directly from the app with a user-provided API key (`features/food/services/mealAnalysis.ts`, `apiConfig.ts`). Store readiness requires:

- No API key in the app binary
- Free tier: 10 AI scans/month
- Manual meal logging never blocked
- Privacy-first: no accounts, anonymous device identity

Feature 23 (RevenueCat + paywall) is out of scope for this ADR.

## Decision

Move all production AI calls behind a Cloudflare Worker proxy with server-side quota enforcement in KV.

### Quota rules

- **What counts:** Every AI call (photo vision or text description) = 1 scan.
- **What is free:** Manual nutrition entry with no AI.
- **When decremented:** On successful GPT response with valid nutrition JSON only.
- **Reset:** Calendar month UTC; KV key includes `YYYY-MM`.
- **Limit:** 10 scans/month per device UUID.

### Identity

- Device UUID: random v4, stored in SecureStore, created on first launch.
- No RevenueCat / Plus check in Feature 22 — all devices treated as free tier.

### API surface

```
POST /analyze   — AI scan (photo or text), returns result + quota
GET  /quota     — Read-only quota sync for Food screen
```

Errors:

```
429 → { error: "quota_exhausted", quota: { used, limit, remaining } }
502 → { error: "ai_service_error" }
503 → { error: "proxy_unavailable" }
```

Client pre-checks cached `remaining` for fast UX; server always authoritative. Three distinct error shapes let the client show the right message: warm prompt for quota, retry prompt for service/unavailable.

### Abuse prevention (v1)

- Accept UUID rotation as privacy tradeoff.
- Cloudflare IP rate limiting (light) to stop bulk abuse.
- No Play Integrity / attestation in v1.

### App changes

- Remove production API key UI; keep `__DEV__` BYOK escape hatch only.
- ManualEntryScreen: single screen with "Analyze" (quota'd) and "Skip AI — enter manually" (free).
- Photo snap at quota 0: camera works, analyze skipped, lands on manual entry with photo attached.
- Food screen: quiet quota line under date; warmer at ≤3 remaining; manual-log message at 0.
- Client resizes photos (~1024px max edge) before upload; worker enforces hard payload cap.
- Client caches `remaining` count in SecureStore alongside device UUID. Synced via `GET /quota` on Food screen mount. Avoids splash on every scan — server is always authoritative on `/analyze`.
- Photo snap at quota 0: camera captures, saves photo, skips analyze, lands on ManualEntryScreen with photo attached and blank nutrition fields. User can type description → AI text scan (costs 1 if quota available) or fill fields manually (free).

### Infrastructure

- Worker lives at `workers/ai-proxy/` in monorepo.
- Staging + production Wrangler environments with separate KV namespaces.
- OpenRouter key in Cloudflare secrets (never in app).

## Consequences

**Positive**

- API key never ships in binary.
- Quota enforced server-side; cannot bypass by clearing app storage alone (new UUID = new quota, accepted tradeoff).
- Feature 23 can add entitlement header to same `/analyze` contract without breaking changes.

**Negative**

- Requires worker deployment before production AI works (mitigated by `__DEV__` BYOK).
- KV eventual consistency: rare off-by-one on concurrent requests — acceptable for v1.
- UUID rotation grants fresh 10 scans — monitored via cost metrics.

## Out of scope (Feature 23+)

- RevenueCat entitlement / Plus unlimited scans
- Paywall UI at quota exhausted
- Delete-all wiping device UUID (Feature 24, but SecureStore key designed for it)
