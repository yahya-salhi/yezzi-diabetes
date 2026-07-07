# Memory — Reading Save Fix

Last updated: 2026-07-07

## What was built

- **Fixed save failure in `AddReadingScreen.tsx`** — replaced `uuid` (v14) with `expo-crypto` for UUID generation

## Decisions made

- **`expo-crypto` over `uuid`** — `uuid` v14 depends on `crypto.getRandomValues` (Web Crypto API), which is not available in Hermes. `expo-crypto`'s `randomUUID()` is designed for React Native and works in Hermes.
- **Caught error now exposed** — added `err` parameter to the `catch` block in `handleSave` so the actual error message is shown in the alert and logged to console, rather than being swallowed by a generic message.

## Problems solved

- **`ReferenceError: Property 'crypto' doesn't exist`** — caused by `uuid` v14 relying on `crypto.getRandomValues`, which Hermes does not provide. Fixed by switching to `expo-crypto`'s `randomUUID()`.

## Current state

- Glucose reading form (AddReadingScreen) saves successfully after the `expo-crypto` swap
- `uuid` package is no longer used (was only used in AddReadingScreen)
- Error logging in `handleSave` now shows the real error message

## Next session starts with

Test saving glucose readings of all types (fasting, pre_meal, post_meal, bedtime, other) to confirm the fix works across the board. Then continue with any pending feature work.

## Open questions

None.
