import { InviteTrainerForm } from '@/components/admin/InviteTrainerForm';
import { ManagementActions } from '@/components/admin/ManagementActions';
import { MemberStatusList } from '@/components/admin/MemberStatusList';
import { MonthlyProgressChart } from '@/components/admin/MonthlyProgressChart';
import { MonthlyTotalSessions } from '@/components/admin/MonthlyTotalSessions';
import { MonthNavigator } from '@/components/admin/MonthNavigator';
import { StatCard } from '@/components/admin/StatCard';
import { TrainerPerformanceList } from '@/components/admin/TrainerPerformanceList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useInvitations } from '@/context/InvitationContext'; // 👈 초대 컨텍스트 훅 임포트
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { addMonths, subMonths } from 'date-fns';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';


export default function AdminDashboardScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isInviteModalVisible, setInviteModalVisible] = useState(false); // 👈 모달 상태 추가
  const dashboardData = useAdminDashboard(selectedDate);
  const { inviteTrainer } = useInvitations(); // 👈 초대 함수 가져오기

  const handlePrevMonth = () => {
    setSelectedDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    // 미래 월은 선택하지 못하도록 막을 수 있습니다.
    // if (isAfter(selectedDate, subMonths(new Date(), 1))) return;
    setSelectedDate(prevDate => addMonths(prevDate, 1));
  };


  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <ThemedView style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title">관리자 대시보드</ThemedText>
            <ThemedText type="subtitle">PACET 센터의 모든 현황을 확인하고 관리하세요.</ThemedText>
          </View>

          <MonthNavigator 
            currentDate={selectedDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          <ThemedText type="subtitle" style={styles.sectionTitle}>종합 KPI</ThemedText>
          <View style={styles.kpiContainer}>
            <StatCard
              title="총 회원"
              value={`${dashboardData.kpi.totalMembers}명`}
            />
            <StatCard
              title="총 트레이너"
              value={`${dashboardData.kpi.totalTrainers}명`}
            />
            <StatCard
              title="회원 출석률"
              value={`${dashboardData.kpi.memberAttendanceRate}%`}
              color={dashboardData.kpi.memberAttendanceRate >= 90 ? Colors.pacet.success : Colors.pacet.warning}
            />
            <StatCard
              title="트레이너 약속이행률"
              value={`${dashboardData.kpi.trainerFulfillmentRate}%`}
              color={dashboardData.kpi.trainerFulfillmentRate >= 90 ? Colors.pacet.success : Colors.pacet.warning}
            />
          </View>

          <View style={styles.mainContent}>
            <View style={styles.leftColumn}>
              <MonthlyProgressChart 
                data={dashboardData.monthlyProgress} 
                trainers={dashboardData.trainersForPicker} // 👈 trainers prop 전달
              />
              <TrainerPerformanceList data={dashboardData.trainerPerformance} selectedDate={selectedDate} />
            </View>
            <View style={styles.rightColumn}>
              <MonthlyTotalSessions count={dashboardData.totalMonthlySessions} />
              <ManagementActions onInviteTrainerPress={() => setInviteModalVisible(true)} />
              <MemberStatusList members={dashboardData.membersList} />
            </View>
          </View>
        </ThemedView>
      </ScrollView>
      <Modal
        visible={isInviteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <InviteTrainerForm
            onInvite={inviteTrainer}
            onClose={() => setInviteModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    contentContainer: { paddingBottom: 24 },
    content: { padding: 16 },
    header: { marginBottom: 16 },
    kpiContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
    mainContent: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, marginHorizontal: -8 },
    leftColumn: { flex: 2, minWidth: 300, paddingHorizontal: 8 },
    rightColumn: { 
      flex: 1, 
      minWidth: 200, 
      paddingHorizontal: 8,
      gap: 16,
    },
    sectionTitle: {
      marginBottom: 12,
      paddingLeft: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }
}); 