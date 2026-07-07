import { View, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { colors, spacing } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

type Props = {
  fastingData: { value: number; label: string }[];
  postMealData: { value: number; label: string }[];
};

export function TrendChart({ fastingData, postMealData }: Props) {
  const hasData = fastingData.length > 0 || postMealData.length > 0;

  if (!hasData) {
    return (
      <Card>
        <EmptyState message="Start logging to see your trends" />
      </Card>
    );
  }

  return (
    <Card>
      <View style={styles.chart}>
        <LineChart
          data={fastingData}
          data2={postMealData}
          color1={colors.accent}
          color2={colors.info}
          dataPointsColor1={colors.accent}
          dataPointsColor2={colors.info}
          startFillColor1={colors.accent}
          startFillColor2={colors.info}
          startOpacity={0.1}
          endOpacity={0.1}
          xAxisLabelTextStyle={styles.axisLabel}
          yAxisTextStyle={styles.axisLabel}
          noOfSections={5}
          scrollToEnd
          height={200}
          spacing={60}
          initialSpacing={20}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  chart: {
    alignItems: "center",
  },
  axisLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
});
