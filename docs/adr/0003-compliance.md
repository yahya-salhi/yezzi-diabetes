# ADR 0003: Compliance Pack Architecture

**Status:** Accepted  
**Date:** 2026-07-23  
**Feature:** 23 — Compliance Pack

## Context

To release YeZZi on Google Play, the app must comply with Google Play's health and safety declarations, data privacy policies, and user data-deletion requirements:
1. **Medical Disclaimer:** Google Play requires a clear declaration that wellness/tracking apps are not medical devices and do not provide medical advice. It must be shown prominently on first use.
2. **Privacy Policy:** Must be hosted at a public URL (GitHub Pages) and declare how user data (local health records, transient meal photos, anonymous device ID) is handled.
3. **Data Deletion:** The app must offer a complete data-wipe mechanism ("Delete all my data") that removes all traces of local data, secure storage credentials, and logs out of subscription platforms.
4. **Anonymous Analytics:** Any analytics must be privacy-first, avoiding tracking personal health data, IP addresses, or personal identifiers.

## Decision

Implement the Compliance Pack features to meet Google Play requirements using a privacy-first local architecture:

### 1. In-App Medical Disclaimer
- **First-Run Onboarding:** Add a new **Step 0: Medical Disclaimer** as the very first screen of the onboarding flow. The user cannot proceed to unit selection or target range configuration without tapping "Agree & Continue".
- **Settings Access:** Add a row under a new `LEGAL` group in the Settings screen. Tapping it displays the full disclaimer text using a native React Native `Alert.alert`.
- **Disclaimer text:** "YeZZi is a diabetes tracking companion, not a medical device. It does not provide medical advice, diagnosis, or treatment. Always consult your healthcare team before changing your insulin, medication, diet, or exercise routines."

### 2. Privacy Policy & Hosting
- **Policy content:** Define a simple one-liner privacy policy hosted on a GitHub Pages site: "YeZZi stores all health data locally on your device. We do not collect or store your personal data. Meal photos are processed in-memory via our secure proxy and are never saved or stored."
- **Settings Access:** Add a row "Privacy Policy" under the `LEGAL` group in Settings. Tapping it opens the public URL (`https://yezzi-diabetes.github.io/privacy`) in the default system browser via React Native's `Linking.openURL`.

### 3. Data Deletion
- **Implementation:** The data wipe is already implemented in `features/settings/services/dataWipe.ts`.
- **UX Alignment:** Ensure the trigger in `SettingsScreen.tsx` is under a clear section (e.g. `DATA`) and labeled "Clear all data" or "Delete all my data". Upon confirmation, it executes:
  1. Deletion of all rows in `glucose_readings`, `food_log`, `reminder_preferences`, and `user_preferences`.
  2. Removal of SecureStore keys `device_uuid` and `cached_quota`.
  3. De-registration/logout from the subscription service (RevenueCat).
  4. App reload via `expo-updates` to reset the onboarding state.

### 4. Anonymous Analytics
- **Tool choice:** Choose **Aptabase** over PostHog.
- **Rationale:** Aptabase is open-source, lightweight, mobile-first, and does not track IP addresses, device names, or personal identifiers out of the box, making it GDPR/HIPAA compliant.
- **Tracking boundaries:**
  - Track only high-level feature event counts (e.g. `app_first_launch`, `reading_added`, `meal_added`, `backup_created`, `subscription_upgraded`).
  - Never track health-related data values (e.g., blood glucose levels, insulin dosages, food names, meal descriptions, or photos).

### 5. Play Store Declarations
- Declare the app as a wellness/tracking tool, not a medical device.
- Declare collected data types: meal photos (processed, not stored), anonymous device ID (diagnostics/quota), purchase state (subscription management), and anonymous analytics events.

## Consequences

**Positive**
- Fully meets Google Play compliance requirements for store approval.
- High privacy standard (no accounts, local storage, transient processing only) as a market differentiator.
- App-native Alert and browser linking keep the bundle size small and logic simple.
- Aptabase keeps analytics lightweight and strictly private.

**Negative**
- Requires maintaining an external GitHub Pages site for the privacy policy URL.
- Onboarding has one extra click/step for the user.

## Out of scope
- iOS App Store privacy declaration (deferred to App Store launch in v1.2).
- Advanced cookie banners or cookie consent flows (since no cookies are used).
