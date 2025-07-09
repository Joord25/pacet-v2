import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ViewMode = "monthly" | "weekly";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          viewMode === "monthly" ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => onViewModeChange("monthly")}
      >
        <Text
          style={[
            styles.buttonText,
            viewMode === "monthly"
              ? styles.activeButtonText
              : styles.inactiveButtonText,
          ]}
        >
          월간
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          viewMode === "weekly" ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => onViewModeChange("weekly")}
      >
        <Text
          style={[
            styles.buttonText,
            viewMode === "weekly"
              ? styles.activeButtonText
              : styles.inactiveButtonText,
          ]}
        >
          주간
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.light.gray,
    borderRadius: 999,
    padding: 4,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  activeButton: {
    backgroundColor: Colors.pacet.primary,
  },
  inactiveButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  activeButtonText: {
    color: "#fff",
  },
  inactiveButtonText: {
    color: Colors.light.text,
  },
}); 