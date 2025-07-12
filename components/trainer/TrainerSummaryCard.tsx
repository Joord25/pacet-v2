import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "@/styles/commonStyles";
import React from "react";
import { StyleSheet, View } from "react-native";

interface TodaySummaryCardProps {
  totalClasses: number;
  attendedClasses: number;
  monthlySessions: number;
  monthlySales?: number; // 🚨 optional number 타입으로 추가
}

// 헬퍼 컴포넌트 추가
const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.statItem}>
    <ThemedText style={styles.statLabel}>{label}</ThemedText>
    <ThemedText style={styles.statValue}>{value}</ThemedText>
  </View>
);


export function TrainerSummaryCard({
  totalClasses,
  attendedClasses,
  monthlySessions,
  monthlySales = 0, // 🚨 props 추가 및 기본값 설정
}: TodaySummaryCardProps) {
  const formattedSales = new Intl.NumberFormat('ko-KR').format(monthlySales);

  return (
    <View style={[styles.card, commonStyles.cardShadow]}>
      <View style={styles.mainContent}>
        <ThemedText style={styles.title}>오늘의 스케줄</ThemedText>
        <View style={styles.classCountContainer}>
          <ThemedText style={styles.classCount}>{totalClasses}</ThemedText>
          <ThemedText style={styles.classCountUnit}>개의 수업</ThemedText>
        </View>
        <ThemedText style={styles.attendedText}>
          {attendedClasses}명 출석 완료
        </ThemedText>
      </View>
      
      <View style={styles.divider} />

      {/* --- 이번달 통계 --- */}
      <View style={styles.monthlyStatsContainer}>
        <Stat label="이번달 총 수업" value={`${monthlySessions}회`} />
        <Stat label="이번달 매출" value={`₩${formattedSales}`} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.pacet.primary,
    borderRadius: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  divider: {
    width: 1,
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  monthlyStatsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 16, // 항목 간 간격
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 13,
    color: Colors.trainer.textWhite,
    opacity: 0.8,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.trainer.textWhite,
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