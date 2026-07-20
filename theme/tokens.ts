export const colors = {
  background: "#F4F2EE",
  surface: "#FFFFFF",
  surfaceSecondary: "#FAF9F7",
  textPrimary: "#1A1D1C",
  textSecondary: "#6B6E6D",
  textMuted: "#A1A4A3",
  accent: "#1B5E5A",
  accentLight: "#E8F0EF",
  success: "#1B8A5A",
  warning: "#B8860B",
  error: "#C5304B",
  errorLight: "#FEF2F2",
  info: "#4E7FA7",
  border: "#E3DFD8",
  borderLight: "#EDEAE4",
} as const;

export const typography = {
  statNumber: { fontSize: 34, fontWeight: "700" as const, lineHeight: 40, color: colors.textPrimary },
  readingValue: { fontSize: 32, fontWeight: "700" as const, lineHeight: 38 },
  screenTitle: { fontSize: 22, fontWeight: "600" as const, lineHeight: 30, color: colors.textPrimary },
  sectionHeading: { fontSize: 17, fontWeight: "600" as const, lineHeight: 24, color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22, color: colors.textPrimary },
  cardLabel: { fontSize: 14, fontWeight: "500" as const, lineHeight: 20, color: colors.textSecondary },
  muted: { fontSize: 13, fontWeight: "400" as const, lineHeight: 18, color: colors.textMuted },
  badge: { fontSize: 13, fontWeight: "500" as const, lineHeight: 18 },
  buttonLabel: { fontSize: 15, fontWeight: "600" as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16, color: colors.textMuted },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
} as const;

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;
