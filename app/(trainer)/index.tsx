import { ThemedText } from "@/components/ThemedText";
import { ActionButtonGroup } from "@/components/trainer/ActionButtonGroup";
import { IntegratedSummaryCard } from "@/components/trainer/IntegratedSummaryCard"; // 🚨 변경
import { InviteMemberModal } from "@/components/trainer/InviteMemberModal";
import { ScheduleItem } from "@/components/trainer/ScheduleItem";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useContracts } from "@/context/ContractContext";
import { useTrainerDashboardData } from "@/hooks/useTrainerDashboardData"; // 🚨 변경
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react"; // 🚨 useMemo 제거 예정
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";


// 🚨 기존 데이터 처리 로직은 모두 삭제하고, 새로 만든 훅을 사용합니다.

export default function TrainerDashboardScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { inviteMember } = useContracts();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 🚨 새로 만든 훅 사용
  const {
    isLoading,
    todayScheduleCount,
    completedScheduleCount,
    monthlyRevenue,
    onTimeRate,
    monthlyCompletedSessions,
    monthlyIssues,
    currentMonth,
    todaySessions, // 오늘의 스케줄 리스트를 위해 받아옵니다.
    trainer,
  } = useTrainerDashboardData();


  useLayoutEffect(() => {
    if (trainer) {
      navigation.setOptions({
        title: `${trainer.name} 트레이너`,
      });
    }
  }, [navigation, trainer]);

  // 🚨 로딩 상태 처리
  if (isLoading || !trainer) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.pacet.primary} />
      </SafeAreaView>
    );
  }

  type TodaySession = (typeof todaySessions)[0];

  const renderScheduleItem = ({ item }: { item: TodaySession }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(common)/member/${item.memberId}`)}
      activeOpacity={0.8}
    >
      <ScheduleItem session={item} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <ThemedText type="title" style={styles.headerTitle}>
                {trainer.name}님,
              </ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                오늘도 활기찬 하루 보내세요! 💪
              </ThemedText>
            </View>

            {/* 🚨 새로운 통합 카드로 교체 */}
            <IntegratedSummaryCard
              todayScheduleCount={todayScheduleCount}
              completedScheduleCount={completedScheduleCount}
              monthlyRevenue={monthlyRevenue}
              onTimeRate={onTimeRate}
              monthlyCompletedSessions={monthlyCompletedSessions}
              monthlyIssues={monthlyIssues}
              currentMonth={currentMonth}
            />

            <ActionButtonGroup />
            <ThemedText style={styles.listTitle}>오늘의 수업</ThemedText>
          </>
        }
        data={todaySessions}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item.sessionId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              오늘 예정된 수업이 없습니다.
            </ThemedText>
          </View>
        }
      />

      <InviteMemberModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onInvite={inviteMember}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="person-add-outline" size={24} color={Colors.pacet.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.pacet.lightBg,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100, // FAB에 가려지지 않도록 충분한 패딩 추가
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontWeight: "900",
  },
  headerSubtitle: {
    fontSize: 18,
    color: Colors.pacet.lightText,
    marginTop: 4,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.pacet.darkText,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.pacet.lightText,
  },
  // --- Modal Styles ---
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: Colors.pacet.primary, // 오렌지색
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 