import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "@/styles/commonStyles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function ActionButtonGroup() {
  return (
    <View style={styles.container}>
      {/* QR 출석체크 버튼 */}
      <TouchableOpacity
        style={[styles.qrButton, commonStyles.cardShadow]}
        activeOpacity={0.8}
      >
        <Ionicons name="qr-code" size={24} color="white" style={styles.icon} />
        <ThemedText style={styles.qrButtonText}>QR 출석체크</ThemedText>
      </TouchableOpacity>

      {/* 하단 버튼 그룹 */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.smallButton, commonStyles.cardShadow]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={Colors.light.text}
            style={styles.icon}
          />
          <ThemedText style={styles.smallButtonText}>스케줄 관리</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.smallButton, commonStyles.cardShadow]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="bar-chart-outline"
            size={20}
            color={Colors.light.text}
            style={styles.icon}
          />
          <ThemedText style={styles.smallButtonText}>회원 리포트</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    gap: 16,
  },
  qrButton: {
    backgroundColor: "#1f2937", // slate-800
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 24,
  },
  qrButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 8,
  },
  bottomButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  smallButton: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.light.gray,
  },
  smallButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
  },
}); 