import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "@/styles/commonStyles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";

interface MonthlyTotalSessionsProps {
  count: number;
}

export function MonthlyTotalSessions({ count }: MonthlyTotalSessionsProps) {
  return (
    <ThemedView style={[styles.container, commonStyles.cardShadow]}>
      <ThemedText style={styles.title}>월 전체 수업 진행</ThemedText>
      <ThemedView style={styles.content}>
        <Ionicons
          name="calendar-outline"
          size={32}
          color={Colors.pacet.primary}
        />
        <ThemedText style={styles.count}>{count}회</ThemedText>
      </ThemedView>
      <ThemedText style={styles.description}>
        이번 달에 진행된 총 수업 횟수입니다.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  count: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.pacet.darkText,
  },
  description: {
    fontSize: 13,
    color: Colors.light.textMuted,
    textAlign: "center",
    marginTop: 12,
  },
}); 