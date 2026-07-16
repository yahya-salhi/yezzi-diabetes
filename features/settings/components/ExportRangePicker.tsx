import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import type { ExportRange } from "@/features/settings/services/csvExport";
import { RANGE_LABELS } from "@/features/settings/services/csvExport";

type Props = {
  visible: boolean;
  onSelect: (range: ExportRange) => void;
  onCancel: () => void;
};

const OPTIONS: ExportRange[] = ["7", "30", "90", "all"];

export function ExportRangePicker({ visible, onSelect, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onCancel}>
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.card}>
            <Text style={styles.title}>Select date range</Text>
            {OPTIONS.map((range, idx) => (
              <View key={range}>
                {idx > 0 && <View style={styles.divider} />}
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => onSelect(range)}
                >
                  <Text style={styles.label}>{RANGE_LABELS[range]}</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={onCancel}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
    width: "100%",
    maxWidth: 320,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
    paddingVertical: spacing.lg,
  },
  row: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textPrimary,
    textAlign: "center",
  },
  cancel: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.accent,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});
