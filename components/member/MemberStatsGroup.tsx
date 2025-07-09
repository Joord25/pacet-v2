import { ThemedText } from "@/components/ThemedText";
import { commonStyles } from "@/styles/commonStyles";
import React from "react";
import { StyleSheet, View } from "react-native";

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
}

const StatCard = ({ label, value, unit }: StatCardProps) => (
  <View style={[styles.card, commonStyles.cardShadow]}>
    <ThemedText style={styles.label}>{label}</ThemedText>
    <View style={styles.valueContainer}>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <ThemedText style={styles.unit}>{unit}</ThemedText>
    </View>
  </View>
);

interface MemberStatsGroupProps {
  remainingPT: number;
  latenessCount: number;
  absenceCount: number;
}

export function MemberStatsGroup({
  remainingPT,
  latenessCount,
  absenceCount,
}: MemberStatsGroupProps) {
  return (
    <View style={styles.container}>
      <StatCard label="남은 회원권" value={remainingPT} unit="회" />
      <StatCard label="지각 횟수" value={latenessCount} unit="회" />
      <StatCard label="결석 횟수" value={absenceCount} unit="회" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#6b7280", // gray-500
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937", // gray-800
  },
  unit: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#1f2937", // gray-800
    marginLeft: 2,
  },
}); 