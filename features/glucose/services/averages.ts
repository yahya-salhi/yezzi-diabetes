import { getDb } from "@/db/database";

export async function getDailyAverage(date: string): Promise<number | null> {
  try {
    const db = await getDb();
    const row = await db.getFirstAsync<{ avg: number | null }>(
      "SELECT AVG(value) as avg FROM glucose_readings WHERE date = ?",
      [date],
    );
    return row?.avg ?? null;
  } catch (err) {
    console.error("[averages] getDailyAverage failed", err);
    return null;
  }
}

export async function getRollingAverage(
  days: number,
  type?: string,
): Promise<number | null> {
  try {
    const db = await getDb();
    const params: string[] = [String(days)];
    let typeFilter = "";
    if (type) {
      typeFilter = " AND type = ?";
      params.push(type);
    }
    const row = await db.getFirstAsync<{ avg: number | null }>(
      `SELECT AVG(value) as avg FROM glucose_readings
       WHERE date >= date('now', '-' || ? || ' days')${typeFilter}`,
      params,
    );
    return row?.avg ?? null;
  } catch (err) {
    console.error("[averages] getRollingAverage failed", err);
    return null;
  }
}
