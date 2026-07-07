export const colors = {
  background: "#F6F7FB",
  surface: "#FFFFFF",
  surfaceSecondary: "#F9FAFB",
  textPrimary: "#101828",
  textSecondary: "#6A7282",
  textMuted: "#99A1AF",
  accent: "#7C5CFC",
  success: "#10B981",
  warning: "#FF8904",
  error: "#EF4444",
  info: "#61A8FF",
  border: "#E7EAF3",
  borderLight: "#E5E7EB",
} as const;

export const typography = {
  statNumber: { fontSize: 30, fontWeight: "700" as const, lineHeight: 36, color: colors.textPrimary },
  screenTitle: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28, color: colors.textPrimary },
  sectionHeading: { fontSize: 16, fontWeight: "600" as const, lineHeight: 24, color: colors.textPrimary },
  body: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20, color: colors.textPrimary },
  cardLabel: { fontSize: 14, fontWeight: "500" as const, lineHeight: 20, color: colors.textSecondary },
  readingValue: { fontSize: 28, fontWeight: "700" as const, lineHeight: 34 },
  muted: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16, color: colors.textMuted },
  badge: { fontSize: 12, fontWeight: "500" as const, lineHeight: 16 },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;
