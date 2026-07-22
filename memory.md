# Memory — Feature 22 (cont): YeZZi Plus RevenueCat Setup & Android Fixes

Last updated: 2026-07-22

## What was built

- **RevenueCat project configured via API v2:**
  - Created `is_plus` entitlement (lookup_key: `is_plus`)
  - Created products: `yezzi_plus_monthly` (P1M, id: `prodd6a91f11e0`) and `yezzi_plus_yearly` (P1Y, id: `prod780715f0a9`) under Test Store app
  - Attached both products to `is_plus` entitlement
  - Replaced default test store products in existing `$rc_monthly` / `$rc_annual` packages with our products
  - Removed old test store products (Monthly, Yearly, Lifetime), Lifetime package, and archived old `yezzi Pro` entitlement
  - Default offering now has 2 packages: Monthly → yeazi_plus_monthly, Yearly → yeazzi_plus_yearly

- **Code fixes applied:**
  - `features/plus/screens/PaywallScreen.tsx` — identifier checks now include `"annual"` to match `$rc_annual` package
  - `features/plus/services/entitlement.ts`:
    - `deriveIsPlus` uses `?.isActive` instead of `typeof` key existence check
    - Error codes corrected: code 3 → codes 10 (NetworkError) / 35 (OfflineConnectionError)
    - Added string variant checks (`"10"`, `"35"`) for cross-platform Android/iOS bridge compatibility

- **Git history (branch `feat/yezzi-plus-paywall`):**
  - `f0e445f` — feat(plus): add RevenueCat SDK, PlusStore, PaywallScreen, and API config
  - `736da0f` — feat: wire is_plus entitlement into food analysis, settings, and data wipe
  - `773dd54` — fix(plus): correct RevenueCat error codes and deriveIsPlus check

## Decisions made

- **Test Store products for dev** — products live under RevenueCat's Test Store app since no iOS/Play Store app credentials are configured. Store identifiers match what the app code expects (`yezzi_plus_monthly`, `yezzi_plus_yearly`). When real stores are set up later, products can be imported and packages re-linked.
- **$rc_annual identifier** — RevenueCat's default yearly package uses `$rc_annual` (not `$rc_yearly`). Code patched to check both `"yearly"` and `"annual"`.
- **Cross-platform error codes** — RevenueCat error enums are strings (`"1"`) but native bridge may return numbers (`1`). Both variants checked defensively.

## Problems solved

- **RevenueCat error code 3 → 10/35** — code 3 is `PurchaseNotAllowedError` (parental controls, not signed in), not a network error. Correct network codes are 10 (`NetworkError`) and 35 (`OfflineConnectionError`).
- **deriveIsPlus fragility** — old `typeof` check would false-positive if RevenueCat ever included inactive entitlements in the `active` map. `?.isActive` is the documented API.
- **PaywallScreen yearly detection** — `$rc_annual` doesn't contain "yearly". Added `"annual"` fallback to find the yearly package.

## Current state

- RevenueCat project `proj8d60c761` is configured for Android/test development:
  - `is_plus` entitlement → `yezzi_plus_monthly` + `yezzi_plus_yearly` products
  - Default offering with 2 packages, currently active
  - Test Store public API key (`test_SztDywCDNyzKAgAfHdypxGqxYZQ`) in `config.ts` — works for Android
- iOS app not set up in RevenueCat (couldn't create — API key lacked `apps:read_write`)
- MCP config updated with write-enabled key for future RevenueCat API access
- 3 commits on branch `feat/yezzi-plus-paywall`, unpushed

## Next session starts with

**Feature 23 — Compliance Pack** (Phase 3, Store Readiness & v1 Launch)

From progress-tracker: privacy policy, terms of service, consent flows, data retention, and any store-required legal screens. Google Play requires this before listing.

Check `docs/superpowers/specs/` for the store readiness design doc.

**Also pending:**
- `git push origin feat/yezzi-plus-paywall` and open PR to `main`
- Run `npm run android` (requires Android emulator) to verify RevenueCat offerings load and purchase flow works end-to-end

## Open questions

- Feature 23 Compliance Pack scope not yet reviewed — needs spec read
- iOS App Store app not configured in RevenueCat — user focused on Android only for now
- iOS SDK API key (`appl_...`) still a placeholder in `config.ts` — needs iOS app setup first
- Branch `feat/yezzi-plus-paywall` not yet pushed or merged
