import { Paths, File } from "expo-file-system";
import { dispatchDocument } from "./documentDispatcher";
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
    throw err;
  }
}

export async function writeCsvFile(csvString: string): Promise<string> {
  const d = new Date();
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const filename = `yezzi-readings-${date}.csv`;
  const file = new File(Paths.document, filename);
  file.write(csvString);
  return `${Paths.document.uri}${filename}`;
}

export async function shareCsvFile(uri: string): Promise<void> {
  await dispatchDocument(uri, {
    mimeType: "text/csv",
    UTI: "public.comma-separated-values-text",
    dialogTitle: "Export glucose readings",
  });
}
