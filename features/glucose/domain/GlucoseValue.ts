const MGDL_PER_MMOL = 18.0182;
const MIN_MGDL = 20;
const MAX_MGDL = 600;

export class GlucoseValue {
  private constructor(private readonly mgdl: number) {}

  static fromMgdl(value: number): GlucoseValue {
    return new GlucoseValue(value);
  }

  static fromMmol(value: number): GlucoseValue {
    return new GlucoseValue(value * MGDL_PER_MMOL);
  }

  static parse(value: number, unit: "mg/dL" | "mmol/L"): GlucoseValue {
    return unit === "mg/dL" ? GlucoseValue.fromMgdl(value) : GlucoseValue.fromMmol(value);
  }

  toMgdl(): number {
    return this.mgdl;
  }

  toMmol(): number {
    return this.mgdl / MGDL_PER_MMOL;
  }

  toDisplay(unit: "mg/dL" | "mmol/L"): string {
    if (unit === "mg/dL") return String(Math.round(this.mgdl));
    return this.toMmol().toFixed(1);
  }

  toDisplayWithUnit(unit: "mg/dL" | "mmol/L"): string {
    return `${this.toDisplay(unit)} ${unit}`;
  }

  static isValidInput(value: string, unit: "mg/dL" | "mmol/L"): boolean {
    const num = Number(value);
    if (isNaN(num) || num <= 0) return false;
    const parsed = GlucoseValue.parse(num, unit);
    return parsed.mgdl >= MIN_MGDL && parsed.mgdl <= MAX_MGDL;
  }

  static rangeLabel(unit: "mg/dL" | "mmol/L"): string {
    const min = unit === "mg/dL" ? String(MIN_MGDL) : (MIN_MGDL / MGDL_PER_MMOL).toFixed(1);
    const max = unit === "mg/dL" ? String(MAX_MGDL) : (MAX_MGDL / MGDL_PER_MMOL).toFixed(1);
    return `${min}\u2013${max}`;
  }
}
