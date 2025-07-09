import { StyleSheet } from "react-native";

export const SCANNER_FRAME_SIZE = 240;

export const qrScannerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  header: {
    position: "absolute",
    top: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    marginTop: 8,
    color: "white",
    opacity: 0.8,
  },
  scannerFrame: {
    width: SCANNER_FRAME_SIZE,
    height: SCANNER_FRAME_SIZE,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    shadowColor: "rgb(255, 92, 0)",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "white",
    borderWidth: 5,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 24,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 24,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 24,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 24,
  },
  cancelButton: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#22c55e", // green-500
    alignItems: "center",
    justifyContent: "center",
  },
  successText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 16,
  },
}); 