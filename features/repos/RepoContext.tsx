import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";
import { createSqliteGlucoseReadings, type GlucoseReadings } from "@/features/glucose/GlucoseReadings";
import { createSqliteFoodLog, type FoodLogRepo } from "@/features/food/services/foodLog";
import { createSqliteImpactEstimator, type ImpactEstimator } from "@/features/food/services/impactEstimator";

type Repos = {
  glucoseReadings: GlucoseReadings;
  foodLog: FoodLogRepo;
  impactEstimator: ImpactEstimator;
};

const RepoContext = createContext<Repos | null>(null);

type RepoProviderProps = {
  children: ReactNode;
  glucoseReadings?: GlucoseReadings;
  foodLog?: FoodLogRepo;
  impactEstimator?: ImpactEstimator;
};

export function RepoProvider({ children, glucoseReadings, foodLog, impactEstimator }: RepoProviderProps) {
  const defaultGlucoseRef = useRef<GlucoseReadings | undefined>(undefined);
  const defaultFoodRef = useRef<FoodLogRepo | undefined>(undefined);
  const defaultImpactRef = useRef<ImpactEstimator | undefined>(undefined);

  const repos = useMemo<Repos>(() => ({
    glucoseReadings: glucoseReadings ?? (defaultGlucoseRef.current ??= createSqliteGlucoseReadings()),
    foodLog: foodLog ?? (defaultFoodRef.current ??= createSqliteFoodLog()),
    impactEstimator: impactEstimator ?? (defaultImpactRef.current ??= createSqliteImpactEstimator()),
  }), [glucoseReadings, foodLog, impactEstimator]);

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

export function useImpactEstimator(): ImpactEstimator {
  const ctx = useContext(RepoContext);
  if (!ctx) {
    throw new Error("useImpactEstimator must be used within a <RepoProvider>");
  }
  return ctx.impactEstimator;
}
