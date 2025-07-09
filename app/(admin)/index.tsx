import { StatCard } from "@/components/member_detail/StatCard";
import { ThemedText } from "@/components/ThemedText";
import { allUsers } from "@/constants/mocks";
import { useAuth } from "@/context/AuthContext";
import { useSessions } from "@/context/SessionContext";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect, useMemo } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

const useAdminDashboardData = () => {
  const { sessions } = useSessions();
  const users = allUsers;

  return useMemo(() => {
    // Timezone 문제를 해결하기 위해 로컬 시간 기준으로 오늘 날짜 계산
    const today = new Date();
    const today_utc = new Date(today.getTime() - (today.getTimezoneOffset() * 60000));
    const today_string = today_utc.toISOString().split("T")[0];

    const totalMembers = users.filter((u) => u.role === "member").length;
    const totalTrainers = users.filter((u) => u.role === "trainer").length;

    const todaysSessions = sessions.filter((s) => s.sessionDate === today_string);
    const scheduledToday = todaysSessions.filter(
      (s) => s.status === "confirmed" || s.status === "pending"
    ).length;
    const attendedToday = todaysSessions.filter(
      (s) => s.status === "attended"
    ).length;

    return {
      totalMembers,
      totalTrainers,
      scheduledToday,
      attendedToday,
    };
  }, [sessions, users]);
};

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const stats = useAdminDashboardData();

  useLayoutEffect(() => {
    if (user) {
      navigation.setOptions({
        title: `${user.name} 관리자`,
      });
    }
  }, [navigation, user]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">종합 현황</ThemedText>
        <ThemedText style={styles.subtitle}>
          센터의 주요 지표를 확인하세요.
        </ThemedText>
      </View>
      <View style={styles.statsContainer}>
        <StatCard
          label="총 회원"
          value={`${stats.totalMembers}명`}
          icon="person"
        />
        <StatCard
          label="총 트레이너"
          value={`${stats.totalTrainers}명`}
          icon="people"
        />
        <StatCard
          label="오늘 총 수업"
          value={`${stats.scheduledToday + stats.attendedToday}건`}
          icon="calendar"
        />
        <StatCard
          label="출석 완료"
          value={`${stats.attendedToday}건`}
          icon="checkmark-done"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
}); 