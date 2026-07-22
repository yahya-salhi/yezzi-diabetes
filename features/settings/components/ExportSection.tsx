import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { ExportRangePicker } from "./ExportRangePicker";
import { PdfPreviewModal } from "./PdfPreviewModal";
import { useExportWorkflow } from "../hooks/useExportWorkflow";
import { usePlus } from "@/features/plus/hooks/usePlus";
import { PaywallScreen } from "@/features/plus/screens/PaywallScreen";

export function ExportSection() {
  const { isPlus } = usePlus();
  const [showPaywall, setShowPaywall] = useState(false);
  const {
    rangePickerVisible,
    csvLoading,
    pdfLoading,
    pdfPreviewVisible,
    pdfReadings,
    pdfRangeLabel,
    pdfShareLoading,
    pdfPrefs,
    handleExportPress,
    handleRangeSelect,
    handleRangeCancel,
    handlePdfShare,
    handlePdfClose,
  } = useExportWorkflow();

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
          onPress={() => {
            if (isPlus) {
              handleExportPress("pdf");
            } else {
              setShowPaywall(true);
            }
          }}
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

      <PaywallScreen visible={showPaywall} onClose={() => setShowPaywall(false)} />
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
