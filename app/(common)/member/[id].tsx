import { ThemedView } from "@/components/ThemedView";
import {
    AttendanceCalendar,
} from "@/components/member_detail/AttendanceCalendar";
import { CoachingNotes } from "@/components/member_detail/CoachingNotes";
import { StatCard } from "@/components/member_detail/StatCard";
import { Colors } from "@/constants/Colors";
import { allSessions, allUsers, Session } from "@/constants/mocks";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

// 회원 상세 데이터와 통계를 계산하는 커스텀 훅
const useMemberDetails = (memberId: string | undefined) => {
  const details = useMemo(() => {
    if (!memberId) return null;

    const member = allUsers.find(
      (u) => u.id === memberId && u.role === "member"
    );
    if (!member) return null;

    const sessions = allSessions.filter((s) => s.memberId === memberId);

    const attended = sessions.filter(
      (s) => s.status === "attended" || s.status === "late"
    ).length;
    const lateness = sessions.filter((s) => s.status === "late").length;
    const absence = sessions.filter((s) => s.status === "no-show").length;
    const totalScheduled = sessions.filter(
      (s) => s.status !== "pending" && s.status !== "cancelled"
    ).length;
    const attendanceRate =
      totalScheduled > 0 ? Math.round((attended / totalScheduled) * 100) : 100;
    const remainingPT = (member.ptTotalSessions || 0) - attended;

    const attendanceHistory = sessions.map((s: Session) => ({
      date: s.sessionDate,
      status: s.status,
    }));

    const notes = sessions
      .filter((s) => s.memo)
      .map((s) => `${s.sessionDate}: ${s.memo}`)
      .join("\n");

    return {
      member,
      stats: { attendanceRate, lateness, absence, remainingPT },
      calendar: { attendanceHistory },
      notes,
    };
  }, [memberId]);

  return details;
};

export default function MemberDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const memberDetails = useMemberDetails(id);

  if (!memberDetails) {
    // memberDetails가 로드 중이거나 없을 경우
    // 404로 보내기 전에 로딩 상태를 표시하는 것이 더 나은 UX를 제공할 수 있습니다.
    // useEffect(() => { if(!memberDetails) router.replace('/+not-found') }, [memberDetails])
    return null;
  }

  const { member, stats, calendar, notes } = memberDetails;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: `${member.name} 회원님` }} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.statsContainer}>
          <View style={styles.statCardWrapper}>
            <StatCard
              label="전체 출석률"
              value={stats.attendanceRate}
              unit="%"
              valueColor={
                stats.attendanceRate < 90
                  ? Colors.pacet.info
                  : Colors.pacet.primary
              }
            />
          </View>
          <View style={styles.statCardWrapper}>
            <StatCard label="총 지각" value={stats.lateness} unit="회" />
          </View>
          <View style={styles.statCardWrapper}>
            <StatCard label="총 결석" value={stats.absence} unit="회" />
          </View>
          <View style={styles.statCardWrapper}>
            <StatCard label="잔여 PT" value={stats.remainingPT} unit="회" />
          </View>
        </View>

        <CoachingNotes initialNotes={notes} />

        <AttendanceCalendar
          year={2025}
          month={6}
          attendanceHistory={calendar.attendanceHistory}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 24, // 컴포넌트 사이 간격
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  statCardWrapper: {
    width: "50%",
    padding: 6,
  },
}); 