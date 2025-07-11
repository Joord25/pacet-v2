import { commonStyles } from '@/styles/commonStyles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

interface StatCardProps {
  title: string;
  value: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  return (
    <View style={[styles.kpiCard, commonStyles.cardShadow]}>
      <ThemedText style={styles.kpiTitle}>{title}</ThemedText>
      <ThemedText style={[styles.kpiValue, color ? { color } : {}]}>
        {value}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  kpiCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16, // 내부 패딩 조정
    width: '49%', // 너비를 49%로 지정하여 한 줄에 2개씩 배치
    marginBottom: 12, // 카드 사이의 수직 간격
  },
  kpiTitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 4,
  },
}); 