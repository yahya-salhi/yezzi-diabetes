import { getDb } from "@/db/database";
import { subDays, format } from "date-fns";
import type { GlucoseReading } from "@/features/glucose/types";

export async function getReadingsForRange(days: number): Promise<GlucoseReading[]> {
  try {
    const db = await getDb();
    const startDate = format(subDays(new Date(), days), "yyyy-MM-dd");
    return await db.getAllAsync<GlucoseReading>(
      "SELECT * FROM glucose_readings WHERE date >= ? ORDER BY date ASC, time ASC",
      [startDate],
    );
  } catch (err) {
    console.error("[trends] getReadingsForRange failed", err);
    return [];
  }
}
