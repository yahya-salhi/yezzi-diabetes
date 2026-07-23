# ADR 0002: YeZZi Plus Subscription + Paywall

**Status:** Accepted  
**Date:** 2026-07-21  
**Feature:** YeZZi Plus - Subscription + Paywall

## Context

YeZZi's v1 monetization model is freemium:

- Core glucose tracking remains free forever.
- Manual meal logging remains free forever.
- Free users receive 10 AI scans per UTC calendar month.
- YeZZi Plus unlocks unlimited AI scans and PDF doctor reports.
- Paywalls must appear only at natural moments, never at app launch.

ADR 0001 established the Cloudflare Worker AI proxy, anonymous device UUID, and
KV-backed free scan quota. This ADR defines the purchase, entitlement, paywall,
and Plus-to-proxy contract for v1.

## Decision

Use RevenueCat for Google Play subscriptions and treat the RevenueCat entitlement
as the on-device source of purchase truth.

### Entitlement and products

- Entitlement key: `is_plus`
- Monthly product ID: `yezzi_plus_monthly`
- Yearly product ID: `yezzi_plus_yearly`
- Launch pricing:
  - Monthly: $2.99/month
  - Yearly: $19.99/year

`is_plus` is active when RevenueCat customer info reports the entitlement as
active. Otherwise the user is treated as free tier.

### Plus benefits

YeZZi Plus unlocks:

- Unlimited AI scans
- PDF doctor reports
- Future premium insights, if added later

The following stay free:

- Manual glucose tracking
- Manual meal logging
- Reading reminders
- Logging streak
- Backup and restore
- CSV export
- Delete-all data

### Paywall placement

The paywall is shown only at natural gated moments:

- A free user has 0 scans remaining and taps an AI analysis action.
- A free user taps the PDF doctor report export.

The paywall is never shown on launch.

Settings will include a visible YeZZi Plus row for status, upgrade access, and
restore/management entry points. This is acceptable because Settings is an
expected purchase-management surface, not an interruption.

### Quota exhausted behavior

When a free user has no scans remaining, the UI must offer two choices:

- **Upgrade** - opens the YeZZi Plus paywall.
- **Enter manually** - keeps the user in the free manual logging path.

Manual logging must remain available at every quota state.

### Proxy contract

For v1, the client sends `is_plus` in the `/analyze` request body.

When `is_plus === true`, the Worker skips:

- KV quota check
- KV quota increment

When `is_plus !== true`, the Worker applies the free-tier quota rules from
ADR 0001.

This keeps the v1 architecture simple and avoids a custom subscription backend.

### Trust model

The v1 proxy uses a client-trusted Plus flag. Server-side RevenueCat validation
is explicitly deferred until post-launch.

Rationale:

- YeZZi has no accounts and no custom backend in v1.
- RevenueCat already handles purchase state on-device.
- Expected AI scan cost is low enough that spoofing risk is acceptable for launch.
- The proxy and app contract can be hardened later without changing the paywall UX.

### Cancellation and restore

If RevenueCat reports `is_plus` inactive:

- User returns to free-tier behavior immediately.
- AI scans use the current monthly quota again.
- PDF doctor report export is gated again.
- Existing local data and previously exported files remain untouched.

Settings must include a restore purchases action. Restore refreshes RevenueCat
customer info and updates the local entitlement state.

### Privacy boundary

Purchase state is handled by RevenueCat and Google Play.

Health data remains local:

- Glucose readings
- Food logs
- Backups
- CSV exports
- PDF reports
- User preferences

Meal photos continue to leave the device only for AI analysis through the proxy,
as defined in ADR 0001. Purchase state must not be mixed with health records.

## Consequences

### Positive

- Simple v1 implementation with no custom subscription backend.
- Paywall appears only when the user asks for a premium benefit.
- Manual logging remains reliable and free.
- RevenueCat manages Google Play purchase edge cases and restore flow.
- The proxy already has a stable `is_plus` bypass path.

### Negative

- A modified client could spoof `is_plus` and bypass scan quota.
- Entitlement enforcement is weaker than server-side validation.
- Plus state depends on the client refreshing RevenueCat customer info correctly.

### Mitigations

- Accept spoofing risk for v1 because expected scan cost is low.
- Monitor AI proxy usage and free-to-Plus conversion after launch.
- Keep server-side RevenueCat validation as the post-launch hardening path.
- Keep all manual logging paths independent from purchase state.

## Out of scope

- Server-side RevenueCat entitlement validation
- Play Integrity or device attestation
- App Store products
- Introductory offers, trials, coupons, or win-back campaigns
- Account-based subscription sync
- Any cloud storage of health records
