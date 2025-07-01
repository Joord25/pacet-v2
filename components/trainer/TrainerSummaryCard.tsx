import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "@/styles/commonStyles";
import { LinearGradient } from "expo-linear-gradient";
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
    <LinearGradient
      colors={[Colors.trainer.gradientStart, Colors.trainer.gradientEnd]}
      style={[styles.card, commonStyles.cardShadow]}
    >
      <ThemedText style={styles.title}>오늘의 스케줄</ThemedText>
      <View>
        <ThemedText style={styles.classCount}>
          {totalClasses}
          <ThemedText style={styles.classCountUnit}>개의 수업</ThemedText>
        </ThemedText>
        <ThemedText style={styles.attendedText}>
          {attendedClasses}명 출석 완료
        </ThemedText>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.trainer.textWhite,
    opacity: 0.9,
    marginBottom: 8,
  },
  classCount: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.trainer.textWhite,
  },
  classCountUnit: {
    fontSize: 20,
    fontWeight: "normal",
  },
  attendedText: {
    fontSize: 14,
    color: Colors.trainer.textWhite,
    opacity: 0.8,
    marginTop: 4,
  },
}); 