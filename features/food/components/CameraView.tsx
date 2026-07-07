import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView as ExpoCameraView, useCameraPermissions, type FlashMode } from "expo-camera";
import { colors, spacing } from "@/theme/tokens";

type Props = {
  onCapture: (uri: string) => void;
  onClose: () => void;
};

export function CameraView({ onCapture, onClose }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>("off");
  const [cameraRef, setCameraRef] = useState<ExpoCameraView | null>(null);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionOverlay}>
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionMessage}>
            YeZZ needs camera access to capture photos of your meals for AI-powered food recognition.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Access</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.permissionSkip}>Not now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoCameraView
        ref={setCameraRef}
        style={styles.camera}
        facing="back"
        flash={flash}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topButton} onPress={onClose}>
            <Text style={styles.topButtonText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => setFlash(flash === "off" ? "on" : "off")}
          >
            <Text style={styles.topButtonText}>
              {flash === "on" ? "⚡" : "☀"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.overlayContainer}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.cropFrame}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom}>
            <Text style={styles.hint}>Frame your meal in the square</Text>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <View style={styles.bottomPlaceholder} />
          <TouchableOpacity
            style={styles.captureButton}
            onPress={async () => {
              if (cameraRef) {
                const photo = await cameraRef.takePictureAsync();
                if (photo) onCapture(photo.uri);
              }
            }}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <View style={styles.bottomPlaceholder} />
        </View>
      </ExpoCameraView>
    </View>
  );
}

const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  permissionOverlay: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxxl,
    gap: spacing.lg,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  permissionMessage: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.md,
  },
  permissionButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  permissionSkip: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: 56,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  topButtonText: {
    fontSize: 22,
    color: "#FFFFFF",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
  overlayTop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  overlayMiddle: {
    flexDirection: "row",
    height: 300,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  cropFrame: {
    width: 300,
    height: 300,
    position: "relative",
  },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: "#FFFFFF",
  },
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: "#FFFFFF",
  },
  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: "#FFFFFF",
  },
  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: "#FFFFFF",
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  hint: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.5,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingBottom: 48,
    paddingTop: spacing.xl,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomPlaceholder: {
    width: 44,
    height: 44,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
});
