import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "@/styles/commonStyles";
import React from "react";
import { StyleSheet, View } from "react-native";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  valueColor?: string;
}

export function StatCard({
  label,
  value,
  unit,
  valueColor = Colors.pacet.darkText,
}: StatCardProps) {
  return (
    <View style={[styles.card, commonStyles.cardShadow]}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText style={[styles.value, { color: valueColor }]}>
        {value}
        {unit && <ThemedText style={styles.unit}>{unit}</ThemedText>}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    color: Colors.light.textMuted,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
  },
  unit: {
    fontSize: 18,
    fontWeight: "normal",
  },
}); 