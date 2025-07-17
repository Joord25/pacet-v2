import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// 나중에 동적 데이터를 받을 수 있도록 Props 타입을 정의합니다.
export interface IntegratedSummaryCardProps {
  todayScheduleCount: number;
  completedScheduleCount: number;
  monthlyRevenue: number;
  onTimeRate: number;
  monthlyCompletedSessions: number;
  monthlyIssues: number;
  currentMonth: number;
}

export function IntegratedSummaryCard({
  todayScheduleCount,
  completedScheduleCount,
  monthlyRevenue,
  onTimeRate,
  monthlyCompletedSessions,
  monthlyIssues,
  currentMonth,
}: IntegratedSummaryCardProps) {
  return (
    <LinearGradient
      colors={['#FF8C42', '#FF6347']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* 1. 오늘의 스케줄 및 월 매출 정보 */}
      <View>
        <ThemedText style={styles.title}>오늘의 스케줄</ThemedText>
        <View style={styles.mainInfoContainer}>
          <View>
            <ThemedText style={styles.scheduleCountText}>
              {todayScheduleCount}
              <ThemedText style={styles.scheduleUnitText}>개의 수업</ThemedText>
            </ThemedText>
            <View style={styles.completedContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ opacity: 0.9, marginRight: 4 }} />
              <ThemedText style={styles.completedText}>
                {completedScheduleCount}명 출석 완료
              </ThemedText>
            </View>
          </View>
          <View style={styles.revenueContainer}>
            <ThemedText style={styles.revenueTitle}>이번달 매출</ThemedText>
            <ThemedText style={styles.revenueAmountText}>
              ₩{monthlyRevenue.toLocaleString()}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 2. 월간 성과 정보 */}
      <View>
        <ThemedText style={styles.title}>
          이달의 내 성과 ({currentMonth}월)
        </ThemedText>
        <View style={styles.performanceGrid}>
          <View style={styles.performanceItem}>
            <ThemedText style={styles.performanceLabel}>약속 이행률</ThemedText>
            <View style={styles.performanceValueContainer}>
              {onTimeRate < 90 && (
                <Ionicons 
                  name="alert-circle" 
                  size={20} 
                  color="#FFFFFF"
                  style={styles.warningIcon} 
                />
              )}
              <ThemedText style={styles.performanceValue}>
                {onTimeRate}%
              </ThemedText>
            </View>
          </View>
          <View style={styles.performanceItem}>
            <ThemedText style={styles.performanceLabel}>완료한 수업</ThemedText>
            <ThemedText style={styles.performanceValue}>
              {monthlyCompletedSessions}
              <ThemedText style={styles.performanceUnit}>건</ThemedText>
            </ThemedText>
          </View>
          <View style={styles.performanceItem}>
            <ThemedText style={styles.performanceLabel}>지각/취소</ThemedText>
            <ThemedText style={styles.performanceValue}>
              {monthlyIssues}
              <ThemedText style={styles.performanceUnit}>건</ThemedText>
            </ThemedText>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 16, // 🚨 간격을 24에서 16으로 줄여 더 보기 좋게 조정합니다.
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  mainInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleCountText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scheduleUnitText: {
    fontSize: 24,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  completedText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  revenueContainer: {
    alignItems: 'flex-end',
  },
  revenueTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  revenueAmountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 20,
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  performanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  performanceValueContainer: { // 🚨 추가: 아이콘과 텍스트를 묶는 컨테이너
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIcon: { // 🚨 추가: 경고 아이콘 스타일
    marginRight: 4,
    opacity: 0.9,
  },
  performanceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // onTimeRateValue 스타일은 이제 사용하지 않으므로 삭제합니다.
  performanceUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
}); 