# Memory — Feature 22: AI Proxy + Scan Quota

Last updated: 2026-07-21

## What was built

### Feature 22 — AI Proxy + Scan Quota

**Cloudflare Worker:**
- **Created `workers/ai-proxy/src/index.ts`** — Cloudflare Worker with two endpoints: `POST /analyze` (AI scan proxied to OpenRouter) and `GET /quota` (read-only quota sync). Routes: photo or text mode. KV quota enforcement via `quota:{device_uuid}:{YYYY-MM}` keys. 30s timeout. CORS headers. Error contract: 429 (quota_exhausted), 502 (ai_service_error), 503 (proxy_unavailable).
- **Created `workers/ai-proxy/package.json`, `tsconfig.json`, `wrangler.toml`** — Worker config, KV namespace `QUOTA` bound, deployed to `ai-proxy.pcclub10.workers.dev`
- **Secrets:** `OPENROUTER_API_KEY` set via `wrangler secret put` (never in code)

**Client proxy infrastructure:**
- **Created `features/food/services/aiProxy.ts`** — `getDeviceId()` (expo-crypto randomUUID, persisted in SecureStore), `analyzeMeal()` (POST to proxy), `fetchQuota()` (GET /quota with SecureStore caching), `QuotaStore` (shared observable pattern for cross-screen quota sync). Error classes: `QuotaExhaustedError`, `AiServiceError`, `ProxyUnavailableError`
- **Created `features/food/hooks/useQuota.ts`** — `useQuota()` hook returns `{ quota, loading, error, refresh }` with mountedRef guard, subscribes to QuotaStore, hydrates cached quota on mount then syncs from server

**Screen changes:**
- **Modified `features/food/screens/ManualEntryScreen.tsx`** — dual-path UI: "Analyze with AI" primary button (quota-gated) + "Skip AI — enter manually" outline button (always free). Error banner for proxy errors. QuotaIndicator below textarea. Photo attachment from camera preserved at quota 0.
- **Modified `features/food/screens/SnapMealScreen.tsx`** — proxy integration replacing direct OpenRouter call
- **Modified `features/food/screens/FoodDashboardScreen.tsx`** — quota indicator line under date header with color states (muted/warning/error)
- **Modified `features/food/hooks/useMealAnalysis.ts`** — proxy integration with `lastQuota` exposure for optimistic UI updates

**Data management:**
- **Created `features/settings/services/dataWipe.ts`** — `deleteAllData()` wipes all tables (glucose_readings, food_log, reminder_preferences, user_preferences) and SecureStore keys (device_uuid, cached_quota)
- **Modified `features/settings/screens/SettingsScreen.tsx`** — delete-all data button with confirmation flow

**Cleanup:**
- **Deleted `features/food/services/mealAnalysis.ts`** — replaced by aiProxy.ts
- **Deleted `features/food/services/apiConfig.ts`** — no longer needed (API key lives server-side)

**Infrastructure & config:**
- **Added `colors.errorLight` to `theme/tokens.ts`** — extracted from inline `#FEF2F2` for error banner usage
- **Modified `App.tsx`** — moved `NavigationContainer` above onboarding conditional to fix navigation context error
- **Added `.env` and `opencode.json` to `.gitignore`**
- **Created `CONTEXT.md`** — domain glossary for AI proxy terms, quota contract, error contract, UX terminology

**Documentation:**
- **Created `docs/adr/0001-ai-proxy-scan-quota.md`** — full architecture decision record
- **Updated `context/progress-tracker.md`** — marked Feature 22 complete
- **Updated `context/ui-registry.md`** — imprinted ErrorBanner, QuotaIndicator, SkipButton patterns
- **Updated `context/code-standards.md`** — added data wipe patterns

## Decisions made

- **Proxy-first architecture** — all production AI calls go through Cloudflare Worker; OpenRouter API key never ships in app binary
- **KV quota enforcement** — 10 scans/month per device UUID, calendar month UTC reset, KV key format `quota:{uuid}:{YYYY-MM}`
- **Device UUID** — random v4 via expo-crypto, stored in SecureStore, created on first launch, no personal data link
- **Error contract** — three distinct HTTP statuses (429 quota, 502 AI error, 503 proxy) with typed client errors
- **Photo resize** — 1024px max edge via expo-image-manipulator before upload to proxy
- **Client-trusted `is_plus` flag** — sent in proxy request body; proxy skips quota check + KV increment when true; no server-side RevenueCat validation for v1 (spoofing risk acceptable at ~$0.01/scan cost)
- **Delete-all wipes** — all SQLite tables + SecureStore keys (device_uuid, cached_quota); app reloads, onboarding re-shown
- **QuotaStore shared observable** — cross-screen quota sync without prop drilling; single source of truth for quota state
- **Cached quota in SecureStore** — avoids splash on every screen mount; server always authoritative on /analyze
- **Calendar month reset** — UTC-based, resets on 1st of each month; key includes YYYY-MM
- **`is_plus` sent in /analyze body** — proxy skips quota increment for Plus users (prepares for Feature 23)

## Problems solved

- **Navigation context error** — `NavigationContainer` was below an early return for onboarding, causing `useNavigation()` to throw. Fixed by moving container above the conditional.
- **Quota store racing** — `useQuota` was setting state after unmount on fast navigation. Fixed with `mountedRef` guard pattern.
- **Invalid JSON from proxy** — empty body or non-JSON responses threw unhandled errors. Added try/catch with 400 return.
- **Direct OpenRouter dead code** — removed `mealAnalysis.ts` and `apiConfig.ts` after migration to proxy. Removed production BYOK UI (kept `__DEV__` escape hatch only).
- **`errorLight` token extraction** — inline `#FEF2F2` hardcoded in ManualEntryScreen error banner was the only remaining hardcoded hex in the app. Extracted to `colors.errorLight`.
- **Onboarding screen formatting** — reformatted long lines, fixed app name from "YeZZ" to "YeZZI" in OnboardingScreen copy.

## Current state

- **Phase 3 — Features 1–22 complete** (Foundation through AI Proxy + Scan Quota)
- Branch: `main` (feat/ai-proxy-scan-quota merged via PR #10)
- Zero TypeScript errors, lint passes
- Cloudflare Worker deployed at `ai-proxy.pcclub10.workers.dev`
- OpenRouter API key set as Cloudflare secret
- All context files (progress-tracker, ui-registry, code-standards, architecture, CONTEXT.md) synced

## Next session starts with

**Feature 23 — YeZZi Plus: Subscription + Paywall** (build-plan item 22)

- RevenueCat SDK integration with `react-native-purchases`
- Google Play products: $2.99/month, $19.99/year
- Entitlement: `is_plus` grants unlimited scans + PDF reports
- Paywall shown at natural moments only (quota exhausted, PDF export) — never at launch
- Wire `is_plus` flag from RevenueCat → proxy `/analyze` calls
- See `docs/superpowers/specs/` for store readiness design doc

## Open questions

- RevenueCat entitlement key / Google Play product IDs need to be configured (not yet set up)
- Plus badge on PDF ExportSection row — gating logic needs Feature 23 to wire (currently cosmetic only)
- OpenRouter key rotation / monitoring plan not yet established
