import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function AdminDashboardScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">관리자 대시보드</ThemedText>
      <ThemedText>트레이너 성과 및 전체 로그</ThemedText>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/(auth)")}
      >
        <ThemedText style={styles.backButtonText}>
          로그인 화면으로 돌아가기
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginTop: 32,
    backgroundColor: Colors.pacet.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.pacet.white,
    fontSize: 16,
    fontWeight: "bold",
  },
}); 