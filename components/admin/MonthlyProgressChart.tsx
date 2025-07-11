import { Colors } from '@/constants/Colors';
import { commonStyles } from '@/styles/commonStyles';
import React, { useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

// 데이터 타입 정의
type ChartItem = { month: string; plan: number; actual: number; isEstimate?: boolean; };
type Trainer = { id: string; name: string; };
interface Props {
    data: { [key: string]: ChartItem[] };
    trainers: Trainer[];
}

// 개별 막대 차트 아이템
const BarItem = ({ month, plan, actual, isEstimate }: ChartItem) => {
  const actualColor = isEstimate ? Colors.pacet.info : Colors.pacet.primary;
  
  return (
    <View style={styles.barContainer}>
      <View style={[styles.planBar, { height: `${plan}%` }]}>
        <View style={[styles.actualBar, { height: `${actual}%`, backgroundColor: actualColor }]} />
      </View>
      <ThemedText style={styles.monthLabel}>{month}</ThemedText>
    </View>
  );
};


export const MonthlyProgressChart: React.FC<Props> = ({ data, trainers }) => {
  const [selectedTrainerId, setSelectedTrainerId] = useState('all');
  const [isPickerVisible, setPickerVisible] = useState(false);

  const selectedTrainerName = trainers.find(t => t.id === selectedTrainerId)?.name;
  const chartData = data[selectedTrainerId] || [];

  const handleSelectTrainer = (id: string) => {
    setSelectedTrainerId(id);
    setPickerVisible(false);
  };

  return (
    <>
      <View style={[styles.card, commonStyles.cardShadow]}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>월별 수업 진행률</ThemedText>
          <TouchableOpacity style={styles.pickerButton} onPress={() => setPickerVisible(true)}>
            <ThemedText style={styles.pickerText}>{selectedTrainerName} ▼</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.chartContainer}>
          {chartData.map((item) => <BarItem key={item.month} {...item} />)}
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: Colors.pacet.lightGray }]} />
            <ThemedText style={styles.legendLabel}>계획된 수업</ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: Colors.pacet.primary }]} />
            <ThemedText style={styles.legendLabel}>실제 진행된 수업</ThemedText>
          </View>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={isPickerVisible}
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => setPickerVisible(false)} activeOpacity={1}>
          <SafeAreaView style={styles.modalContent}>
              <FlatList
                data={trainers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.optionItem} onPress={() => handleSelectTrainer(item.id)}>
                    <ThemedText style={styles.optionText}>{item.name}</ThemedText>
                  </TouchableOpacity>
                )}
              />
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, width: '100%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontWeight: 'bold' },
  pickerButton: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  pickerText: { fontSize: 14 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 180, gap: 16 },
  barContainer: { flex: 1, alignItems: 'center' },
  planBar: { width: '80%', backgroundColor: Colors.pacet.lightGray, borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  actualBar: { width: '100%', borderRadius: 8 },
  monthLabel: { marginTop: 8, fontSize: 12, color: '#6B7280' },
  legendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendIndicator: { width: 12, height: 12, borderRadius: 3, marginRight: 6 },
  legendLabel: { fontSize: 12, color: '#6B7280' },

  // --- Modal Styles ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxHeight: '60%',
  },
  optionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionText: {
    textAlign: 'center',
    fontSize: 16,
  },
}); 