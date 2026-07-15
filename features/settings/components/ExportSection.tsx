import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { colors, spacing } from "@/theme/tokens";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { ExportRangePicker } from "./ExportRangePicker";
import { PdfPreviewModal } from "./PdfPreviewModal";
import {
  generateCsv,
  getReadingsForRange,
  writeCsvFile,
  shareCsvFile,
} from "@/features/settings/services/csvExport";
import {
  generateReportHtml,
  generatePdfFile,
  sharePdfFile,
} from "@/features/settings/services/pdfReport";
import { getPreferences } from "@/features/onboarding/services/preferences";
import { RANGE_LABELS, type ExportRange } from "@/features/settings/services/csvExport";
import type { GlucoseReading } from "@/features/glucose/types";
import type { PdfPreferences } from "@/features/settings/services/reportUtils";

type ExportType = "csv" | "pdf";

const DEFAULT_PREFS: PdfPreferences = {
  unit: "mg/dL",
  fasting_target_low: 70,
  fasting_target_high: 100,
  postmeal_target_low: 70,
  postmeal_target_high: 140,
};

export function ExportSection() {
  const [rangePickerVisible, setRangePickerVisible] = useState(false);
  const [pendingExportType, setPendingExportType] = useState<ExportType | null>(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [pdfReadings, setPdfReadings] = useState<GlucoseReading[]>([]);
  const [pdfRangeLabel, setPdfRangeLabel] = useState("");
  const [pdfHtml, setPdfHtml] = useState("");
  const [pdfShareLoading, setPdfShareLoading] = useState(false);
  const [pdfPrefs, setPdfPrefs] = useState<PdfPreferences>(DEFAULT_PREFS);

  const handleExportPress = useCallback((type: ExportType) => {
    setPendingExportType(type);
    setRangePickerVisible(true);
  }, []);

  const handleRangeSelect = useCallback(async (range: ExportRange) => {
    setRangePickerVisible(false);

    if (pendingExportType === "csv") {
      setCsvLoading(true);
      try {
        const readings = await getReadingsForRange(range);
        if (readings.length === 0) {
          setPendingExportType(null);
          Alert.alert("No data", "No readings found for the selected date range.");
          return;
        }
        const csv = generateCsv(readings);
        const uri = writeCsvFile(csv);
        await shareCsvFile(uri);
      } catch (err: any) {
        Alert.alert("Export failed", err?.message ?? "Something went wrong.");
      } finally {
        setCsvLoading(false);
      }
    } else if (pendingExportType === "pdf") {
      setPdfLoading(true);
      try {
        const readings = await getReadingsForRange(range);
        if (readings.length === 0) {
          setPendingExportType(null);
          Alert.alert("No data", "No readings found for the selected date range.");
          return;
        }
        const prefs = await getPreferences();
        const resolvedPrefs: PdfPreferences = prefs ?? DEFAULT_PREFS;
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

    setPendingExportType(null);
  }, [pendingExportType]);

  const handleRangeCancel = useCallback(() => {
    setRangePickerVisible(false);
    setPendingExportType(null);
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

  return (
    <View>
      <View style={styles.group}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleExportPress("csv")}
          disabled={csvLoading}
        >
          <Text style={styles.label}>Export CSV</Text>
          {csvLoading ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <ChevronRightIcon size={18} color={colors.textMuted} strokeWidth={1.8} />
          )}
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleExportPress("pdf")}
          disabled={pdfLoading}
        >
          <Text style={styles.label}>Export PDF report</Text>
          <View style={styles.rowRight}>
            <View style={styles.plusBadge}>
              <Text style={styles.plusText}>Plus</Text>
            </View>
            {pdfLoading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <ChevronRightIcon size={18} color={colors.textMuted} strokeWidth={1.8} />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ExportRangePicker
        visible={rangePickerVisible}
        onSelect={handleRangeSelect}
        onCancel={handleRangeCancel}
      />

      <PdfPreviewModal
        visible={pdfPreviewVisible}
        readings={pdfReadings}
        rangeLabel={pdfRangeLabel}
        onShare={handlePdfShare}
        onClose={handlePdfClose}
        loading={pdfShareLoading}
        prefs={pdfPrefs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  },
  label: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textPrimary,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  plusBadge: {
    backgroundColor: colors.accentLight,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  plusText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.xl,
  },
});
