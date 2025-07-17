import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "@/styles/commonStyles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient'; // 🚨 그라데이션 적용을 위해 import
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// onInvitePress prop 제거
export function ActionButtonGroup() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* QR 출석체크 버튼 */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/(common)/qr-scanner")}
        style={commonStyles.cardShadow}
      >
        <LinearGradient
          colors={['#FF8C42', '#FF6347']} // 🚨 카드와 동일한 그라데이션 적용
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.qrButton}
        >
          <Ionicons name="qr-code" size={24} color="white" style={styles.icon} />
          <ThemedText style={styles.qrButtonText}>QR 출석체크</ThemedText>
        </LinearGradient>
      </TouchableOpacity>

      {/* 하단 버튼 그룹 */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.smallButton, commonStyles.cardShadow]}
          activeOpacity={0.7}
          onPress={() => router.push("/(common)/schedule")}
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
          onPress={() => router.push("/(trainer)/report")}
        >
          <Ionicons
            name="bar-chart-outline"
            size={20}
            color={Colors.light.text}
            style={styles.icon}
          />
          <ThemedText style={styles.smallButtonText}>회원 리포트</ThemedText>
        </TouchableOpacity>
        {/* --- '회원 초대' 버튼 제거 --- */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 48, // 🚨 간격을 32에서 48로 더 늘려 확실한 시각적 구분을 줍니다.
    gap: 16,
  },
  qrButton: {
    // 🚨 backgroundColor 속성 제거
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
    justifyContent: "space-between", // 🚨 space-between 유지 (gap으로 간격 조절)
    gap: 12, // 🚨 gap으로 버튼 사이 간격 조절
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