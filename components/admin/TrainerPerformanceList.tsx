import { Colors } from '@/constants/Colors';
import { commonStyles } from '@/styles/commonStyles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type TrainerInfo = {
  name: string;
  rate: number;
};

interface Props {
  data: TrainerInfo[];
}

// 개별 트레이너 항목 컴포넌트
const PerformanceItem = ({ name, rate }: { name: string; rate: number }) => {
  const isLowPerformance = rate < 90;
  const barColor = isLowPerformance ? Colors.pacet.warning : Colors.pacet.success;

  return (
    <View style={styles.itemContainer}>
      <ThemedText style={styles.trainerName}>{name}</ThemedText>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBar, { width: `${rate}%`, backgroundColor: barColor }]} />
      </View>
      <ThemedText style={[styles.rateText, { color: barColor }]}>{rate}%</ThemedText>
    </View>
  );
};


// 트레이너 목록 전체를 렌더링하는 컴포넌트
export const TrainerPerformanceList: React.FC<Props> = ({ data }) => {
  return (
    <View style={[styles.card, commonStyles.cardShadow]}>
      <ThemedText type="subtitle" style={styles.title}>트레이너별 약속 이행률</ThemedText>
      <View style={styles.listContainer}>
        {data.map((trainer, index) => (
          <PerformanceItem key={index} name={trainer.name} rate={trainer.rate} />
        ))}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trainerName: {
    width: 65, // 👈 너비 증가
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarBackground: {
    flex: 1,
    height: 12,
    backgroundColor: '#F3F4F6', // bg-slate-200
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  rateText: {
    width: 45, // 👈 너비 증가
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
}); 