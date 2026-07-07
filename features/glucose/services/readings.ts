import { getDb } from "@/db/database";
import type { GlucoseReading, InsertReading } from "@/features/glucose/types";

export async function getReadingsFiltered(
  type?: string,
  startDate?: string,
  endDate?: string,
): Promise<GlucoseReading[]> {
  try {
    const db = await getDb();
    const conditions: string[] = [];
    const params: string[] = [];

    if (type && type !== "all") {
      conditions.push("type = ?");
      params.push(type);
    }
    if (startDate) {
      conditions.push("date >= ?");
      params.push(startDate);
    }
    if (endDate) {
      conditions.push("date <= ?");
      params.push(endDate);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    return await db.getAllAsync<GlucoseReading>(
      `SELECT * FROM glucose_readings ${where} ORDER BY date DESC, time ASC`,
      params,
    );
  } catch (err) {
    console.error("[readings] getReadingsFiltered failed", err);
    return [];
  }
}

export async function getReadings(date?: string): Promise<GlucoseReading[]> {
  try {
    const db = await getDb();
    if (date) {
      return await db.getAllAsync<GlucoseReading>(
        "SELECT * FROM glucose_readings WHERE date = ? ORDER BY time ASC",
        [date],
      );
    }
    return await db.getAllAsync<GlucoseReading>(
      "SELECT * FROM glucose_readings ORDER BY date DESC, time ASC",
    );
  } catch (err) {
    console.error("[readings] getReadings failed", err);
    return [];
  }
}

export async function getReadingById(id: string): Promise<GlucoseReading | null> {
  try {
    const db = await getDb();
    return await db.getFirstAsync<GlucoseReading>(
      "SELECT * FROM glucose_readings WHERE id = ?",
      [id],
    );
  } catch (err) {
    console.error("[readings] getReadingById failed", err);
    return null;
  }
}

export async function insertReading(
  reading: InsertReading,
): Promise<void> {
  try {
    const db = await getDb();
    await db.runAsync(
      `INSERT INTO glucose_readings (id, value, unit, type, date, time, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        reading.id,
        reading.value,
        reading.unit,
        reading.type,
        reading.date,
        reading.time,
        reading.notes,
      ],
    );
  } catch (err) {
    console.error("[readings] insertReading failed", err);
    throw err;
  }
}
