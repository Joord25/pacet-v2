import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useTrainerReport, Violation } from '@/hooks/useTrainerReport';
import { commonStyles } from '@/styles/commonStyles';
import { format, parseISO } from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

// --- Sub-components ---

const SummaryCard = ({ title, value, color }: { title: string; value: string; color?: string }) => (
  <View style={[styles.summaryCard, commonStyles.cardShadow]}>
    <ThemedText style={styles.summaryCardTitle}>{title}</ThemedText>
    <ThemedText style={[styles.summaryCardValue, color ? { color } : {}]}>{value}</ThemedText>
  </View>
);

const ViolationTag = ({ type, lateMinutes }: { type: 'late' | 'cancelled'; lateMinutes?: number }) => {
  const isLate = type === 'late';
  const text = isLate ? `${lateMinutes}분 지각` : '수업 취소';
  
  return (
    <ThemedText style={{ color: Colors.light.error, fontSize: 14 }}>{text}</ThemedText>
  );
};

const ViolationItem = ({ item }: { item: Violation }) => (
  <View style={styles.tableRow}>
    <ThemedText style={[styles.tableCell, styles.dateCell]}>
      {format(parseISO(item.sessionDate), 'yy-MM-dd')}
    </ThemedText>
    <View style={[styles.tableCell, styles.typeCell]}>
      <ViolationTag type={item.violationType} lateMinutes={item.lateMinutes} />
    </View>
    <ThemedText style={styles.tableCell}>{item.memberName}</ThemedText>
    <ThemedText style={styles.tableCell}>{format(parseISO(`${item.sessionDate}T${item.sessionTime}`), 'a h:mm')}</ThemedText>
  </View>
);

// --- Main Component ---

const TrainerViolationReport = () => {
  const { trainerId, month, trainerName = '트레이너' } = useLocalSearchParams<{ trainerId: string; month: string; trainerName: string }>();
  const { summary, violations, isLoading } = useTrainerReport(trainerId, month);

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: `${trainerName} 리포트` }} />
      <ScrollView>
        <View style={styles.summarySection}>
          <SummaryCard 
            title="약속 이행률" 
            value={`${summary.fulfillmentRate}%`} 
            color={Colors.pacet.warning} 
          />
          <SummaryCard title="지각" value={`${summary.lateCount}회`} />
          <SummaryCard title="수업 취소(귀책)" value={`${summary.cancelledCount}회`} />
        </View>

        <View style={[styles.tableContainer, commonStyles.cardShadow]}>
          <View style={styles.tableHeader}>
            <ThemedText style={[styles.tableHeaderCell, styles.dateCell]}>날짜</ThemedText>
            <ThemedText style={[styles.tableHeaderCell, styles.typeCell]}>위반 유형</ThemedText>
            <ThemedText style={styles.tableHeaderCell}>관련 회원</ThemedText>
            <ThemedText style={styles.tableHeaderCell}>예정 시간</ThemedText>
          </View>
          {violations.length > 0 ? (
            violations.map(item => <ViolationItem key={item.sessionId} item={item} />)
          ) : (
            <ThemedText style={styles.noViolationsText}>해당 월의 위반 내역이 없습니다.</ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: Colors.pacet.lightGray },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  summaryCardTitle: {
    fontSize: 13,
    color: Colors.pacet.mediumText,
    marginBottom: 4,
  },
  summaryCardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.pacet.primary,
  },
  tableContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.pacet.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.pacet.border,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.pacet.mediumText,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.pacet.border,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
  dateCell: { flex: 1.2 },
  typeCell: { flex: 1.5 },
  noViolationsText: {
    textAlign: 'center',
    padding: 32,
    color: Colors.pacet.mediumText,
  }
});

export default TrainerViolationReport; 