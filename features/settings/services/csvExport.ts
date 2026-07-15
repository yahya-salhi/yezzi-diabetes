import { Paths, File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getDbAdapter } from "@/db/instance";
import type { DatabasePort } from "@/db/port";
import type { GlucoseReading, ReadingType } from "@/features/glucose/types";

export type ExportRange = "7" | "30" | "90" | "all";

const RANGE_LABELS: Record<ExportRange, string> = {
  "7": "Last 7 Days",
  "30": "Last 30 Days",
  "90": "Last 90 Days",
  all: "All Time",
};

export { RANGE_LABELS };

const CSV_HEADERS = ["Type", "Date", "Time", "Value", "Unit", "Notes"] as const;

const TYPE_LABELS: Record<ReadingType, string> = {
  fasting: "Fasting",
  pre_meal: "Pre-Meal",
  post_meal: "Post-Meal",
  bedtime: "Bedtime",
  other: "Other",
};

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCsv(readings: GlucoseReading[]): string {
  const rows = readings.map((r) => [
    TYPE_LABELS[r.type] ?? r.type,
    r.date,
    r.time,
    String(r.value),
    r.unit,
    r.notes ?? "",
  ]);

  const lines = [
    CSV_HEADERS.join(","),
    ...rows.map((row) => row.map(escapeCsvField).join(",")),
  ];

  return lines.join("\n");
}

export async function getReadingsForRange(
  range: ExportRange,
  db?: DatabasePort,
): Promise<GlucoseReading[]> {
  const adapter = db ?? getDbAdapter();

  try {
    if (range === "all") {
      return adapter.getAllAsync<GlucoseReading>(
        "SELECT * FROM glucose_readings ORDER BY date DESC, time DESC",
      );
    }

    const days = parseInt(range, 10);
    return adapter.getAllAsync<GlucoseReading>(
      "SELECT * FROM glucose_readings WHERE date >= date('now', '-' || ? || ' days') ORDER BY date DESC, time DESC",
      [String(days)],
    );
  } catch (err) {
    console.error("[csvExport] getReadingsForRange failed", err);
    return [];
  }
}

function getCsvFilename(): string {
  const d = new Date();
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return `yezzi-readings-${date}.csv`;
}

export async function writeCsvFile(csvString: string): Promise<{ uri: string; filename: string }> {
  const filename = getCsvFilename();
  const file = new File(Paths.cache, filename);
  file.write(csvString);

  if (!file.exists) {
    throw new Error("CSV file was not created on disk.");
  }

  const written = await file.text();
  if (written.length !== csvString.length) {
    throw new Error(`CSV file content mismatch (expected ${csvString.length} bytes, got ${written.length}).`);
  }

  return { uri: file.uri, filename };
}

export async function shareCsvFile(uri: string): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error("Sharing is not available on this device.");
  }

  const shared = Sharing.shareAsync(uri, {
    dialogTitle: "Export glucose readings",
  });

  const timeout = new Promise<void>((_, reject) =>
    setTimeout(() => reject(new Error("Share timed out")), 8000),
  );

  await Promise.race([shared, timeout]);
}
