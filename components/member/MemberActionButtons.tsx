import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "@/styles/commonStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function MemberActionButtons() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.scheduleButton]}
        onPress={() => router.push("/schedule")}
      >
        <Ionicons name="calendar" size={20} color={Colors.light.text} />
        <ThemedText style={styles.buttonText}>스케줄 관리</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.qrButton]}
        onPress={() => router.push("/qr-scanner")}
      >
        <Ionicons name="qr-code" size={20} color="white" />
        <ThemedText style={[styles.buttonText, { color: "white" }]}>
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
    marginBottom: 24,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
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
}); 