export type RootTabParamList = {
  Dashboard: undefined;
  Food: undefined;
  Workout: undefined;
  Settings: undefined;
};

export type GlucoseStackParamList = {
  DashboardHome: undefined;
  AddReading: undefined;
  History: undefined;
};

export type FoodStackParamList = {
  FoodHome: undefined;
  SnapMeal: undefined;
  ManualEntry: { photoUri?: string } | undefined;
};
