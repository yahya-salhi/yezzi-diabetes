import { useState, useCallback } from "react";
import { useGlucoseReadings, useFoodLogRepo } from "@/features/repos/RepoContext";
import type { FoodLog } from "../types";

type UseMealLinkingResult = {
  suggestibleMeals: FoodLog[];
  showDialog: boolean;
  loading: boolean;
  checkForMeals: (date: string, readingId: string) => Promise<boolean>;
  linkMeal: (mealId: string) => Promise<void>;
  dismiss: () => void;
};

export function useMealLinking(): UseMealLinkingResult {
  const foodLogRepo = useFoodLogRepo();
  const readingsRepo = useGlucoseReadings();
  const [suggestibleMeals, setSuggestibleMeals] = useState<FoodLog[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingReadingId, setPendingReadingId] = useState<string | null>(null);

  const checkForMeals = useCallback(
    async (date: string, readingId: string): Promise<boolean> => {
      setLoading(true);
      try {
        const meals = await foodLogRepo.getUnlinkedMeals(date);
        if (meals.length > 0) {
          setSuggestibleMeals(meals);
          setPendingReadingId(readingId);
          setShowDialog(true);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [foodLogRepo],
  );

  const linkMeal = useCallback(
    async (mealId: string) => {
      if (!pendingReadingId) return;
      try {
        await readingsRepo.linkToMeal(pendingReadingId, mealId);
        setShowDialog(false);
        setSuggestibleMeals([]);
        setPendingReadingId(null);
      } catch {
        // silently fail — user can retry later
      }
    },
    [readingsRepo, pendingReadingId],
  );

  const dismiss = useCallback(() => {
    setShowDialog(false);
    setSuggestibleMeals([]);
    setPendingReadingId(null);
  }, []);

  return { suggestibleMeals, showDialog, loading, checkForMeals, linkMeal, dismiss };
}
