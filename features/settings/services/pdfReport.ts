import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import type { GlucoseReading } from "@/features/glucose/types";
import type { ExportRange } from "./csvExport";
import { RANGE_LABELS } from "./csvExport";
import {
  round,
  barWidth,
  computeAverages,
  buildTrendRows,
  formatDateLong as formatDate,
  type PdfPreferences,
} from "./reportUtils";

function inRangeColor(value: number, low: number, high: number): string {
  if (value < low) return "#B8860B";
  if (value > high) return "#C5304B";
  return "#1B8A5A";
}

function computeInRange(
  readings: GlucoseReading[],
  prefs: PdfPreferences,
) {
  const fasting = readings.filter((r) => r.type === "fasting");
  const postMeal = readings.filter((r) => r.type === "post_meal");

  const inRangeCount = (arr: GlucoseReading[], low: number, high: number) =>
    arr.filter((r) => r.value >= low && r.value <= high).length;

  return {
    fastingPercent:
      fasting.length > 0
        ? Math.round((inRangeCount(fasting, prefs.fasting_target_low, prefs.fasting_target_high) / fasting.length) * 100)
        : null,
    postMealPercent:
      postMeal.length > 0
        ? Math.round((inRangeCount(postMeal, prefs.postmeal_target_low, prefs.postmeal_target_high) / postMeal.length) * 100)
        : null,
  };
}

function generatePdfHtml(
  readings: GlucoseReading[],
  prefs: PdfPreferences,
  rangeLabel: string,
): string {
  const averages = computeAverages(readings);
  const inRange = computeInRange(readings, prefs);
  const trendRows = buildTrendRows(readings);
  const maxValue = Math.max(...readings.map((r) => r.value), 200);

  const now = new Date();
  const generatedDate = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const avgRow = (label: string, value: number | null, count: number, isFasting: boolean) => {
    if (value === null) return "";
    const color = inRangeColor(
      value,
      isFasting ? prefs.fasting_target_low : prefs.postmeal_target_low,
      isFasting ? prefs.fasting_target_high : prefs.postmeal_target_high,
    );
    return `
      <tr>
        <td style="padding:8px 12px;font-size:14px;color:#1A1D1C;">${label}</td>
        <td style="padding:8px 12px;font-size:14px;font-weight:600;color:${color};">${round(value)} mg/dL</td>
        <td style="padding:8px 12px;font-size:13px;color:#6B6E6D;">${count} readings</td>
      </tr>`;
  };

  const rangeRow = (label: string, percent: number | null) => {
    if (percent === null) return "";
    const color = percent >= 70 ? "#1B8A5A" : percent >= 50 ? "#B8860B" : "#C5304B";
    return `
      <tr>
        <td style="padding:8px 12px;font-size:14px;color:#1A1D1C;">${label}</td>
        <td style="padding:8px 12px;font-size:14px;font-weight:600;color:${color};">${percent}%</td>
        <td style="padding:8px 12px;font-size:13px;color:#6B6E6D;">${percent >= 70 ? "Good" : percent >= 50 ? "Fair" : "Needs attention"}</td>
      </tr>`;
  };

  const trendTableRows = trendRows
    .map((row) => {
      const fastingBar = row.fasting !== null
        ? `<div style="display:flex;align-items:center;gap:6px;">
             <div style="width:${barWidth(row.fasting, maxValue)}%;height:8px;background:${inRangeColor(row.fasting, prefs.fasting_target_low, prefs.fasting_target_high)};border-radius:4px;"></div>
             <span style="font-size:12px;color:#1A1D1C;font-weight:500;">${round(row.fasting)}</span>
           </div>`
        : '<span style="font-size:12px;color:#A1A4A3;">—</span>';

      const postMealBar = row.postMeal !== null
        ? `<div style="display:flex;align-items:center;gap:6px;">
             <div style="width:${barWidth(row.postMeal, maxValue)}%;height:8px;background:${inRangeColor(row.postMeal, prefs.postmeal_target_low, prefs.postmeal_target_high)};border-radius:4px;"></div>
             <span style="font-size:12px;color:#1A1D1C;font-weight:500;">${round(row.postMeal)}</span>
           </div>`
        : '<span style="font-size:12px;color:#A1A4A3;">—</span>';

      return `
        <tr>
          <td style="padding:8px 12px;font-size:13px;color:#6B6E6D;border-bottom:1px solid #EDEAE4;">${formatDate(row.date)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #EDEAE4;">${fastingBar}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #EDEAE4;">${postMealBar}</td>
        </tr>`;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:24px;background:#FFFFFF;color:#1A1D1C;">

      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-size:24px;font-weight:700;margin:0 0 4px 0;color:#1B5E5A;">Glucose Report</h1>
        <p style="font-size:14px;color:#6B6E6D;margin:0;">${rangeLabel} · Generated ${generatedDate}</p>
      </div>

      <div style="margin-bottom:28px;">
        <h2 style="font-size:17px;font-weight:600;margin:0 0 12px 0;color:#1A1D1C;border-bottom:1px solid #EDEAE4;padding-bottom:8px;">Averages</h2>
        <table style="width:100%;border-collapse:collapse;">
          ${avgRow("Fasting", averages.fastingAvg, averages.fastingCount, true)}
          ${avgRow("Post-Meal", averages.postMealAvg, averages.postMealCount, false)}
          ${avgRow("Overall", averages.overallAvg, averages.totalCount, false)}
        </table>
      </div>

      <div style="margin-bottom:28px;">
        <h2 style="font-size:17px;font-weight:600;margin:0 0 12px 0;color:#1A1D1C;border-bottom:1px solid #EDEAE4;padding-bottom:8px;">In-Range Summary</h2>
        <table style="width:100%;border-collapse:collapse;">
          ${rangeRow("Fasting", inRange.fastingPercent)}
          ${rangeRow("Post-Meal", inRange.postMealPercent)}
        </table>
      </div>

      <div style="margin-bottom:28px;">
        <h2 style="font-size:17px;font-weight:600;margin:0 0 12px 0;color:#1A1D1C;border-bottom:1px solid #EDEAE4;padding-bottom:8px;">Trend</h2>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="padding:8px 12px;font-size:12px;font-weight:500;color:#6B6E6D;text-align:left;border-bottom:2px solid #E3DFD8;">Date</th>
              <th style="padding:8px 12px;font-size:12px;font-weight:500;color:#6B6E6D;text-align:left;border-bottom:2px solid #E3DFD8;">Fasting (mg/dL)</th>
              <th style="padding:8px 12px;font-size:12px;font-weight:500;color:#6B6E6D;text-align:left;border-bottom:2px solid #E3DFD8;">Post-Meal (mg/dL)</th>
            </tr>
          </thead>
          <tbody>
            ${trendTableRows}
          </tbody>
        </table>
      </div>

      <div style="text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #EDEAE4;">
        <p style="font-size:12px;color:#A1A4A3;margin:0;">Generated by YeZZi · For informational purposes only</p>
      </div>

    </body>
    </html>`;
}

export function generateReportHtml(
  readings: GlucoseReading[],
  prefs: PdfPreferences,
  range: ExportRange,
): string {
  return generatePdfHtml(readings, prefs, RANGE_LABELS[range]);
}

export async function generatePdfFile(html: string): Promise<string> {
  const result = await Print.printToFileAsync({ html, base64: false });
  return result.uri;
}

export async function sharePdfFile(uri: string): Promise<void> {
  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    dialogTitle: "Share glucose report",
  });
}
