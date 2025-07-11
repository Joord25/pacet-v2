import { ThemedText } from "@/components/ThemedText";
import { ActionButtonGroup } from "@/components/trainer/ActionButtonGroup";
import { ScheduleItem } from "@/components/trainer/ScheduleItem";
import { TrainerSummaryCard } from "@/components/trainer/TrainerSummaryCard";
import { Session } from "@/constants/mocks";
import { useAuth } from "@/context/AuthContext";
import { useSessions } from "@/context/SessionContext";
import { useUsers } from "@/context/UserContext";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useMemo } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

// --- 데이터 처리 로직 ---
const useTrainerDashboardData = (
  trainerId: string,
  sessions: Session[]
) => {
  const { users } = useUsers();
  const trainer = useMemo(
    () => users.find((u) => u.id === trainerId && u.role === "trainer"),
    [trainerId, users]
  );

  const todaySessions = useMemo(() => {
    // Timezone 문제를 해결하기 위해 로컬 시간 기준으로 오늘 날짜 계산
    const today = new Date();
    const today_utc = new Date(today.getTime() - (today.getTimezoneOffset() * 60000));
    const today_string = today_utc.toISOString().split("T")[0];

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
    return { totalClasses, attendedClasses };
  }, [todaySessions]);

  return { trainer, todaySessions, stats };
};
// --------------------

export default function TrainerDashboardScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { sessions } = useSessions();

  const { trainer, todaySessions, stats } = useTrainerDashboardData(
    user?.id || "",
    sessions
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
        <View style={styles.container}>
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
      <View style={styles.container}>
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
        />
        <ActionButtonGroup />
        <ThemedText style={styles.listTitle}>오늘의 수업</ThemedText>

        <FlatList
          data={todaySessions}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.sessionId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                오늘 예정된 수업이 없습니다.
              </ThemedText>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb", // gray-50
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontWeight: "900",
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#6b7280", // gray-500
    marginTop: 4,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1f2937",
  },
  listContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
  },
}); 