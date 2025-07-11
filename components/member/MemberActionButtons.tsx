import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "@/styles/commonStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface MemberActionButtonsProps {
  isInactive: boolean;
}

export function MemberActionButtons({ isInactive }: MemberActionButtonsProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.scheduleButton, isInactive && styles.disabledButton]}
        onPress={() => router.push("/(common)/schedule")}
        disabled={isInactive}
      >
        <Ionicons name="calendar" size={20} color={isInactive ? '#9ca3af' : Colors.light.text} />
        <ThemedText style={[styles.buttonText, isInactive && styles.disabledText]}>스케줄 관리</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.qrButton, isInactive && styles.disabledButton]}
        onPress={() => router.push("/(common)/qr-scanner")}
        disabled={isInactive}
      >
        <Ionicons name="qr-code" size={20} color={isInactive ? '#9ca3af' : 'white'} />
        <ThemedText style={[styles.buttonText, { color: isInactive ? '#9ca3af' : "white" }]}>
          QR 출석체크
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    marginVertical: 16,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    ...commonStyles.cardShadow,
  },
  scheduleButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  qrButton: {
    backgroundColor: Colors.pacet.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#e5e7eb', // gray-200
    borderColor: '#d1d5db', // gray-300
    ...commonStyles.cardShadow,
  },
  disabledText: {
    color: '#9ca3af', // gray-400
  }
}); 