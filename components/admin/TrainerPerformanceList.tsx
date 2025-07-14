import { Colors } from '@/constants/Colors';
import { commonStyles } from '@/styles/commonStyles';
import { format } from 'date-fns';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type TrainerInfo = {
  id: string;
  name: string;
  rate: number;
};

interface Props {
  data: TrainerInfo[];
  selectedDate: Date;
}

// 개별 트레이너 항목 컴포넌트
const PerformanceItem = ({ id, name, rate, selectedDate }: TrainerInfo & { selectedDate: Date }) => {
  const isLowPerformance = rate < 90;
  const barColor = isLowPerformance ? Colors.pacet.warning : Colors.pacet.success;

  return (
    <Link 
      href={{
        pathname: `/(admin)/trainer-violation-report/${id}` as any,
        params: { month: format(selectedDate, 'yyyy-MM'), trainerName: name }
      }}
      asChild
    >
      <TouchableOpacity style={styles.itemContainer}>
        <ThemedText style={styles.trainerName}>{name}</ThemedText>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBar, { width: `${rate}%`, backgroundColor: barColor }]} />
        </View>
        <ThemedText style={[styles.rateText, { color: barColor }]}>{rate}%</ThemedText>
      </TouchableOpacity>
    </Link>
  );
};


// 트레이너 목록 전체를 렌더링하는 컴포넌트
export const TrainerPerformanceList: React.FC<Props> = ({ data, selectedDate }) => {
  return (
    <View style={[styles.card, commonStyles.cardShadow]}>
      <ThemedText type="subtitle" style={styles.title}>트레이너별 약속 이행률</ThemedText>
      <View style={styles.listContainer}>
        {data.map((trainer) => (
          <PerformanceItem key={trainer.id} {...trainer} selectedDate={selectedDate} />
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
    // Link는 View가 아니므로 여기에 스타일을 직접 적용합니다.
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