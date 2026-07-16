# Memory — Feature 21: CSV Export + PDF Doctor Report

Last updated: 2026-07-16

## What was built

### Feature 21 — CSV Export + PDF Doctor Report

- **Created `features/settings/services/csvExport.ts`** — `generateCsv()` produces CSV string with headers Type/Date/Time/Value/Unit/Notes from `GlucoseReading[]`; `getReadingsForRange(range)` queries glucose_readings filtered by 7/30/90/all days; `writeCsvFile()` uses `expo-print.printToFileAsync()` to write CSV as `<pre>` HTML to a temp file; `shareCsvFile()` shares via expo-sharing
- **Created `features/settings/services/pdfReport.ts`** — `generateReportHtml()` builds a clinical HTML document with averages section (fasting/post-meal/overall avg + count), in-range summary, and trend table with color-coded horizontal bars; `generatePdfFile()` calls `expo-print.printToFileAsync()`; `sharePdfFile()` shares via expo-sharing with application/pdf mime type
- **Created `features/settings/components/ExportRangePicker.tsx`** — centered card modal with 4 options (Last 7/30/90 Days, All Time), matches MealLinkPicker overlay pattern
- **Created `features/settings/components/PdfPreviewModal.tsx`** — full-screen slide modal with header, scrollable preview of averages + trend table with color-coded in-range bars, full-width share button at bottom
- **Created `features/settings/components/ExportSection.tsx`** — orchestrates both export flows with range picker → CSV direct share or PDF preview → share; Plus badge on PDF row
- **Modified `features/settings/screens/SettingsScreen.tsx`** — added EXPORT section header + `<ExportSection />` between Backup and Data sections
- **Added `expo-print` dependency** — via `npx expo install`

### Registry updates

- **Updated `context/ui-registry.md`** — imprinted ExportSection, ExportRangePicker, PdfPreviewModal

### Progress tracking

- **Updated `context/progress-tracker.md`** — marked Feature 21 complete, next is Feature 22 (AI Proxy + Scan Quota)

## Decisions made

- **Date range picker first** — user selects 7/30/90/All before either export runs
- **CSV direct share** — no preview, shares immediately via system share sheet
- **PDF preview modal** — native RN preview (not WebView) with trend bars, share button generates the actual PDF via expo-print
- **PDF trend = HTML table with colored bars** — no chart library, inline CSS width bars color-coded by in-range status (green/orange/red)
- **Plus badge** — small accentLight tag on PDF row; Plus gating deferred to paywall feature
- **EXPORT section** — new section in Settings between Backup and DATA, follows SettingsGroup pattern exactly

## Problems solved

- **expo-print not installed** — added via `npx expo install expo-print`
- **TS5103 ignoreDeprecations** — reverted `"6.0"` to `"5.0"`; TS 5.9.3 only accepts `"5.0"` (the deprecation warning about baseUrl is for TS 7.0, not an error)
- **View/Text style conflict in PdfPreviewModal** — `tableCell` style with font properties cannot be applied to `<View>`; extracted `viewCell` for container usage
- **null preferences handling** — `getPreferences()` can return null; provided IDF default values as fallback in ExportSection
- **CSV export hang on iOS** — `Sharing.shareAsync` never resolved with `file.uri` from expo-file-system v19 `File` API. Root cause: URI format incompatibility between expo-file-system v19 and expo-sharing. Fix: replaced `expo-file-system` with `expo-print.printToFileAsync()` in `writeCsvFile()` — same approach that makes PDF export work. Removed 8s timeout hack. Zero TS errors after fix.

## Current state

- **Phase 3 — Features 1–21 complete** (Foundation through CSV Export + PDF Doctor Report)
- Branch: `feat/csv-export-pdf-report`
- Zero TypeScript errors, lint passes
- CSV export bug resolved — uses expo-print for file writing
- Memory updated to reflect this session

## Next session starts with

**Feature 22 — AI Proxy + Scan Quota** (build-plan item 21)

- Cloudflare Workers endpoint for OpenRouter proxy
- Anonymous device UUID generation
- Free tier: 10 scans/month
- Manual entry always available even at 0 quota

## Open questions
