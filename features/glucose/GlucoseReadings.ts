import { getDb } from "@/db/database";
import type { GlucoseReading, InsertReading, ReadingType } from "@/features/glucose/types";

export type ReadingFilter = {
  date?: string;
  type?: ReadingType;
  startDate?: string;
  endDate?: string;
  limit?: number;
  orderBy?: "date_desc" | "date_asc";
};

export interface GlucoseReadings {
  query(filter?: ReadingFilter): Promise<GlucoseReading[]>;
  getById(id: string): Promise<GlucoseReading | null>;
  insert(reading: InsertReading): Promise<void>;
  getDailyAverage(date: string): Promise<number | null>;
  getRollingAverage(days: number, type?: ReadingType): Promise<number | null>;
}

export function createSqliteGlucoseReadings(): GlucoseReadings {
  return {
    async query(filter) {
      try {
        const db = await getDb();
        const conditions: string[] = [];
        const params: string[] = [];

        if (filter?.type) {
          conditions.push("type = ?");
          params.push(filter.type);
        }
        if (filter?.date) {
          conditions.push("date = ?");
          params.push(filter.date);
        }
        if (filter?.startDate) {
          conditions.push("date >= ?");
          params.push(filter.startDate);
        }
        if (filter?.endDate) {
          conditions.push("date <= ?");
          params.push(filter.endDate);
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const order = filter?.orderBy === "date_asc" ? "ORDER BY date ASC, time ASC" : "ORDER BY date DESC, time ASC";
        let sql = `SELECT * FROM glucose_readings ${where} ${order}`;

        if (filter?.limit) {
          sql += ` LIMIT ?`;
          params.push(String(filter.limit));
        }

        return await db.getAllAsync<GlucoseReading>(sql, params);
      } catch (err) {
        console.error("[GlucoseReadings] query failed", err);
        return [];
      }
    },

    async getById(id) {
      try {
        const db = await getDb();
        return await db.getFirstAsync<GlucoseReading>(
          "SELECT * FROM glucose_readings WHERE id = ?",
          [id],
        );
      } catch (err) {
        console.error("[GlucoseReadings] getById failed", err);
        return null;
      }
    },

    async insert(reading) {
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
        console.error("[GlucoseReadings] insert failed", err);
        throw err;
      }
    },

    async getDailyAverage(date) {
      try {
        const db = await getDb();
        const row = await db.getFirstAsync<{ avg: number | null }>(
          "SELECT AVG(value) as avg FROM glucose_readings WHERE date = ?",
          [date],
        );
        return row?.avg ?? null;
      } catch (err) {
        console.error("[GlucoseReadings] getDailyAverage failed", err);
        return null;
      }
    },

    async getRollingAverage(days, type) {
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
        console.error("[GlucoseReadings] getRollingAverage failed", err);
        return null;
      }
    },
  };
}

export function createFakeGlucoseReadings(): GlucoseReadings {
  const store: GlucoseReading[] = [];
  let counter = 0;

  return {
    async query(filter) {
      let results = [...store];
      if (filter?.type) results = results.filter((r) => r.type === filter.type);
      if (filter?.date) results = results.filter((r) => r.date === filter.date);
      if (filter?.startDate) results = results.filter((r) => r.date >= filter.startDate!);
      if (filter?.endDate) results = results.filter((r) => r.date <= filter.endDate!);
      return results;
    },

    async getById(id) {
      return store.find((r) => r.id === id) ?? null;
    },

    async insert(reading) {
      counter++;
      store.push({
        ...reading,
        created_at: new Date().toISOString(),
      });
    },

    async getDailyAverage(date) {
      const readings = store.filter((r) => r.date === date);
      if (readings.length === 0) return null;
      return readings.reduce((s, r) => s + r.value, 0) / readings.length;
    },

    async getRollingAverage(days, type) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const readings = store.filter((r) => {
        const d = new Date(r.date);
        if (isNaN(d.getTime())) return false;
        return d >= cutoff && (!type || r.type === type);
      });
      if (readings.length === 0) return null;
      return readings.reduce((s, r) => s + r.value, 0) / readings.length;
    },
  };
}
