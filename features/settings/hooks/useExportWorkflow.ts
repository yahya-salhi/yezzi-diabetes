import { useState, useCallback, useRef } from "react";
import { Alert } from "react-native";
import {
  RANGE_LABELS,
  generateCsv,
  getReadingsForRange,
  writeCsvFile,
  shareCsvFile,
  type ExportRange,
} from "@/features/settings/services/csvExport";
import {
  generateReportHtml,
  generatePdfFile,
  sharePdfFile,
} from "@/features/settings/services/pdfReport";
import { getPreferences, DEFAULTS, type UserPreferences } from "@/features/onboarding/services/preferences";
import type { GlucoseReading } from "@/features/glucose/types";

export type ExportType = "csv" | "pdf";

type ExportWorkflowState = {
  rangePickerVisible: boolean;
  csvLoading: boolean;
  pdfLoading: boolean;
  pdfPreviewVisible: boolean;
  pdfReadings: GlucoseReading[];
  pdfRangeLabel: string;
  pdfHtml: string;
  pdfShareLoading: boolean;
  pdfPrefs: UserPreferences;
};

type ExportWorkflowActions = {
  handleExportPress: (type: ExportType) => void;
  handleRangeSelect: (range: ExportRange) => Promise<void>;
  handleRangeCancel: () => void;
  handlePdfShare: () => Promise<void>;
  handlePdfClose: () => void;
};

export type UseExportWorkflowResult = ExportWorkflowState & ExportWorkflowActions;

export function useExportWorkflow(): UseExportWorkflowResult {
  const [rangePickerVisible, setRangePickerVisible] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [pdfReadings, setPdfReadings] = useState<GlucoseReading[]>([]);
  const [pdfRangeLabel, setPdfRangeLabel] = useState("");
  const [pdfHtml, setPdfHtml] = useState("");
  const [pdfShareLoading, setPdfShareLoading] = useState(false);
  const [pdfPrefs, setPdfPrefs] = useState<UserPreferences>(DEFAULTS);
  const pendingTypeRef = useRef<ExportType | null>(null);

  const handleExportPress = useCallback((type: ExportType) => {
    pendingTypeRef.current = type;
    setRangePickerVisible(true);
  }, []);

  const handleRangeSelect = useCallback(async (range: ExportRange) => {
    setRangePickerVisible(false);

    if (pendingTypeRef.current === "csv") {
      setCsvLoading(true);
      try {
        const readings = await getReadingsForRange(range);
        if (readings.length === 0) {
          pendingTypeRef.current = null;
          Alert.alert("No data", "No readings found for the selected date range.");
          return;
        }
        const csv = generateCsv(readings);
        const uri = await writeCsvFile(csv);
        await shareCsvFile(uri);
      } catch (err: any) {
        Alert.alert("Export failed", err?.message ?? "Something went wrong.");
      } finally {
        setCsvLoading(false);
      }
    } else if (pendingTypeRef.current === "pdf") {
      setPdfLoading(true);
      try {
        const readings = await getReadingsForRange(range);
        if (readings.length === 0) {
          pendingTypeRef.current = null;
          Alert.alert("No data", "No readings found for the selected date range.");
          return;
        }
        const prefs = await getPreferences();
        const resolvedPrefs: UserPreferences = prefs ?? DEFAULTS;
        const html = generateReportHtml(readings, resolvedPrefs, range);
        setPdfReadings(readings);
        setPdfPrefs(resolvedPrefs);
        setPdfRangeLabel(RANGE_LABELS[range]);
        setPdfHtml(html);
        setPdfPreviewVisible(true);
      } catch (err: any) {
        Alert.alert("Export failed", err?.message ?? "Something went wrong.");
      } finally {
        setPdfLoading(false);
      }
    }

    pendingTypeRef.current = null;
  }, []);

  const handleRangeCancel = useCallback(() => {
    setRangePickerVisible(false);
    pendingTypeRef.current = null;
  }, []);

  const handlePdfShare = useCallback(async () => {
    setPdfShareLoading(true);
    try {
      const uri = await generatePdfFile(pdfHtml);
      await sharePdfFile(uri);
    } catch (err: any) {
      Alert.alert("Share failed", err?.message ?? "Something went wrong.");
    } finally {
      setPdfShareLoading(false);
    }
  }, [pdfHtml]);

  const handlePdfClose = useCallback(() => {
    setPdfPreviewVisible(false);
    setPdfReadings([]);
    setPdfHtml("");
  }, []);

  return {
    rangePickerVisible,
    csvLoading,
    pdfLoading,
    pdfPreviewVisible,
    pdfReadings,
    pdfRangeLabel,
    pdfHtml,
    pdfShareLoading,
    pdfPrefs,
    handleExportPress,
    handleRangeSelect,
    handleRangeCancel,
    handlePdfShare,
    handlePdfClose,
  };
}
