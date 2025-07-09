import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "@/styles/commonStyles";
import React from "react";
import { StyleSheet, View } from "react-native";

interface TotalSummaryCardProps {
  rate: number;
}

export function TotalSummaryCard({ rate }: TotalSummaryCardProps) {
  return (
    <View style={[styles.card, commonStyles.cardShadow]}>
      <ThemedText style={styles.label}>담당 회원 전체 출석률</ThemedText>
      <ThemedText style={styles.rateValue}>
        {rate}
        <ThemedText style={styles.rateUnit}>%</ThemedText>
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: Colors.light.textMuted,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.pacet.primary,
    lineHeight: 48,
  },
  rateUnit: {
    fontSize: 24,
    fontWeight: "normal",
  },
}); 