import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";
import { createSqliteGlucoseReadings, type GlucoseReadings } from "@/features/glucose/GlucoseReadings";
import { createSqliteFoodLog, type FoodLogRepo } from "@/features/food/services/foodLog";

type Repos = {
  glucoseReadings: GlucoseReadings;
  foodLog: FoodLogRepo;
};

const RepoContext = createContext<Repos | null>(null);

type RepoProviderProps = {
  children: ReactNode;
  glucoseReadings?: GlucoseReadings;
  foodLog?: FoodLogRepo;
};

export function RepoProvider({ children, glucoseReadings, foodLog }: RepoProviderProps) {
  const defaultGlucoseRef = useRef<GlucoseReadings | undefined>(undefined);
  const defaultFoodRef = useRef<FoodLogRepo | undefined>(undefined);

  const repos = useMemo<Repos>(() => ({
    glucoseReadings: glucoseReadings ?? (defaultGlucoseRef.current ??= createSqliteGlucoseReadings()),
    foodLog: foodLog ?? (defaultFoodRef.current ??= createSqliteFoodLog()),
  }), [glucoseReadings, foodLog]);

  return <RepoContext.Provider value={repos}>{children}</RepoContext.Provider>;
}

export function useGlucoseReadings(): GlucoseReadings {
  const ctx = useContext(RepoContext);
  if (!ctx) {
    throw new Error("useGlucoseReadings must be used within a <RepoProvider>");
  }
  return ctx.glucoseReadings;
}

export function useFoodLogRepo(): FoodLogRepo {
  const ctx = useContext(RepoContext);
  if (!ctx) {
    throw new Error("useFoodLogRepo must be used within a <RepoProvider>");
  }
  return ctx.foodLog;
}
