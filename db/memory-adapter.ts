import type { DatabasePort } from "./port";

type Row = Record<string, unknown>;

function tableName(sql: string): string | null {
  const m = sql.match(/(?:FROM|INTO|TABLE)\s+(?:IF NOT EXISTS\s+)?(\w+)/i);
  return m ? m[1] : null;
}

function parseInsertColumns(sql: string): string[] | null {
  const m = sql.match(/\((.*?)\)\s*(?:VALUES|SELECT)/i);
  if (!m) return null;
  return m[1].split(",").map((c) => c.trim());
}

export function createMemoryDb(): DatabasePort {
  const tables: Record<string, Row[]> = {};

  return {
    async execAsync(sql) {
      const name = tableName(sql);
      if (name && !tables[name]) tables[name] = [];
    },

    async runAsync(sql, params) {
      const name = tableName(sql);
      if (!name) return;
      if (!tables[name]) tables[name] = [];

      if (/^INSERT\s+(OR REPLACE\s+)?INTO/i.test(sql)) {
        const cols = parseInsertColumns(sql);
        if (!cols) return;
        const row: Row = {};
        cols.forEach((col, i) => {
          row[col] = params?.[i] ?? null;
        });

        if (/OR REPLACE/i.test(sql)) {
          const idx = tables[name].findIndex((r) => r.id === row.id);
          if (idx >= 0) tables[name][idx] = row;
          else tables[name].push(row);
        } else {
          tables[name].push(row);
        }
      }
    },

    async getAllAsync(sql, params) {
      const name = tableName(sql);
      if (!name || !tables[name]) return [];

      let rows = [...tables[name]];

      const whereClause = sql.match(/WHERE\s+(.+?)(?:\s+ORDER BY|\s+LIMIT|$)/i);
      if (whereClause) {
        const conditions = whereClause[1].split(/\s+AND\s+/i);
        let paramIdx = 0;
        rows = rows.filter((row) =>
          conditions.every((cond) => {
            const match = cond.match(/^\s*(\w+)\s*(=|>=|<=|>|<|LIKE)\s*(.+?)\s*$/i);
            if (!match) return true;
            const [, col, op] = match;
            const val = row[col];
            const param = params?.[paramIdx];
            paramIdx++;

            if (op === "=") return val === param;
            if (op === ">=") return Number(val) >= Number(param);
            if (op === "<=") return Number(val) <= Number(param);
            if (op === ">") return Number(val) > Number(param);
            if (op === "<") return Number(val) < Number(param);
            return true;
          }),
        );
      }

      if (/ORDER BY\s+(\w+)\s+(ASC|DESC)/i.test(sql)) {
        const [, col, dir] = sql.match(/ORDER BY\s+(\w+)\s+(ASC|DESC)/i)!;
        rows.sort((a, b) => {
          const va = a[col] ?? "";
          const vb = b[col] ?? "";
          return dir.toUpperCase() === "DESC"
            ? String(vb).localeCompare(String(va))
            : String(va).localeCompare(String(vb));
        });
      }

      const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        const limit = parseInt(limitMatch[1], 10);
        const offsetMatch = sql.match(/OFFSET\s+(\d+)/i);
        const offset = offsetMatch ? parseInt(offsetMatch[1], 10) : 0;
        rows = rows.slice(offset, offset + limit);
      }

      return rows as any[];
    },

    async getFirstAsync(sql, params) {
      const rows = await this.getAllAsync(sql, params);
      return (rows[0] as any) ?? null;
    },
  };
}
