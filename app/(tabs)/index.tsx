import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet } from "react-native";

export default function MemberDashboardScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">대시보드</ThemedText>
      <ThemedText>나의 예약 현황</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}); 