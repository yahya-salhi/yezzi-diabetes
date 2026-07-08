export {
  classifyReading as getThresholdStatus,
  getLabel as getThresholdLabel,
  getColor as getThresholdColor,
  getMessage as getThresholdMessage,
  IDF_THRESHOLDS,
  thresholdsFromPreferences,
} from "./ReadingClassifier";

export type { Status as ThresholdStatus, ThresholdMap } from "./ReadingClassifier";
