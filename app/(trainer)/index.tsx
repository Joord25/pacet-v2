import { ThemedText } from "@/components/ThemedText";
import { ActionButtonGroup } from "@/components/trainer/ActionButtonGroup";
import { InviteMemberModal } from "@/components/trainer/InviteMemberModal";
import { ScheduleItem } from "@/components/trainer/ScheduleItem";
import { TrainerSummaryCard } from "@/components/trainer/TrainerSummaryCard";
import { Colors } from "@/constants/Colors"; // 오렌지색 사용을 위해 import
import { useAuth } from "@/context/AuthContext";
import { useContracts } from "@/context/ContractContext"; // 🚨 계약 정보 가져오기
import { useSessions } from "@/context/SessionContext";
import { useUsers } from "@/context/UserContext";
import { Session } from "@/types"; // 🚨 @/types에서 직접 가져오도록 수정
import { Ionicons } from "@expo/vector-icons"; // 아이콘 사용을 위해 import
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useMemo, useState } from "react"; // 🚨 useState 추가
import {
    FlatList,
    SafeAreaView,
    StyleSheet, // 🚨 Modal 추가
    TouchableOpacity,
    View,
} from "react-native";

// --- 데이터 처리 로직 ---
const useTrainerDashboardData = (
  trainerId: string,
  sessions: Session[],
  contracts: any[] // 🚨 contracts 추가
) => {
  const { users } = useUsers();
  const trainer = useMemo(
    () => users.find((u) => u.id === trainerId && u.role === "trainer"),
    [trainerId, users]
  );

  const todaySessions = useMemo(() => {
    // 로컬 시간 기준으로 오늘의 YYYY-MM-DD 문자열을 생성
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const today_string = `${year}-${month}-${day}`;

    return sessions
      .filter(
        (s) =>
          s.trainerId === trainerId &&
          s.sessionDate === today_string &&
          s.status !== 'cancelled'
      )
      .map((session) => {
        const member = users.find((u) => u.id === session.memberId);
        return {
          ...session,
          memberName: member?.name || "알 수 없음",
        };
      })
      .sort(
        (a, b) =>
          new Date(`${a.sessionDate}T${a.sessionTime}`).getTime() -
          new Date(`${b.sessionDate}T${b.sessionTime}`).getTime()
      );
  }, [trainerId, sessions, users]);

  const stats = useMemo(() => {
    const totalClasses = todaySessions.length;
    const attendedClasses = todaySessions.filter(
      (s) => s.status === "completed" || s.status === "trainer-attended"
    ).length;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlySessions = sessions.filter(s => {
      const sessionDate = new Date(s.sessionDate);
      return (
        s.trainerId === trainerId &&
        ['completed', 'late', 'no-show'].includes(s.status) &&
        sessionDate.getFullYear() === currentYear &&
        sessionDate.getMonth() === currentMonth
      );
    }).length;

    const monthlySales = contracts
      .filter(c => {
        const startDate = new Date(c.startDate);
        return (
          c.trainerId === trainerId &&
          c.status === 'active' &&
          startDate.getFullYear() === currentYear &&
          startDate.getMonth() === currentMonth
        );
      })
      .reduce((sum, c) => sum + c.price, 0);

    return { totalClasses, attendedClasses, monthlySessions, monthlySales };
  }, [trainerId, sessions, contracts, todaySessions]);

  return { trainer, todaySessions, stats };
};
// --------------------

export default function TrainerDashboardScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { sessions } = useSessions();
  const { contracts, inviteMember } = useContracts(); 

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { trainer, todaySessions, stats } = useTrainerDashboardData(
    user?.id || "",
    sessions,
    contracts
  );

  useLayoutEffect(() => {
    if (trainer) {
      navigation.setOptions({
        title: `${trainer.name} 트레이너`,
      });
    }
  }, [navigation, trainer]);

  if (!trainer) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <ThemedText>트레이너 정보를 찾을 수 없습니다.</ThemedText>
        </View>
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

            <TrainerSummaryCard
              totalClasses={stats.totalClasses}
              attendedClasses={stats.attendedClasses}
              monthlySessions={stats.monthlySessions}
              monthlySales={stats.monthlySales}
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

      {/* --- 회원 초대 플로팅 버튼 --- */}
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