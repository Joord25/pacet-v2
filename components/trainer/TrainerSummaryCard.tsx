import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "@/styles/commonStyles";
import React from "react";
import { StyleSheet, View } from "react-native";

interface TodaySummaryCardProps {
  totalClasses: number;
  attendedClasses: number;
}

export function TrainerSummaryCard({
  totalClasses,
  attendedClasses,
}: TodaySummaryCardProps) {
  return (
    <View style={[styles.card, commonStyles.cardShadow]}>
      <ThemedText style={styles.title}>오늘의 스케줄</ThemedText>

      <View style={styles.classCountContainer}>
        <ThemedText style={styles.classCount}>{totalClasses}</ThemedText>
        <ThemedText style={styles.classCountUnit}>개의 수업</ThemedText>
      </View>
      <ThemedText style={styles.attendedText}>
        {attendedClasses}명 출석 완료
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.pacet.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.trainer.textWhite,
    opacity: 0.9,
    marginBottom: 8,
  },
  classCountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  classCount: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.trainer.textWhite,
    lineHeight: 42,
  },
  classCountUnit: {
    fontSize: 20,
    fontWeight: "normal",
    color: Colors.trainer.textWhite,
    marginLeft: 6,
  },
  attendedText: {
    fontSize: 14,
    color: Colors.trainer.textWhite,
    opacity: 0.8,
  },
}); 