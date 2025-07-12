import { ThemedView } from "@/components/ThemedView";
import {
  AttendanceCalendar,
} from "@/components/member_detail/AttendanceCalendar";
import { CoachingNotes } from "@/components/member_detail/CoachingNotes";
import { StatCard } from "@/components/member_detail/StatCard";
import { Colors } from "@/constants/Colors";
import { useSessions } from "@/context/SessionContext";
import { useUsers } from "@/context/UserContext";
import { Session } from "@/types";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

// 회원 상세 데이터와 통계를 계산하는 커스텀 훅 (report.tsx와 로직 통일)
const useMemberDetails = (memberId: string | undefined) => {
  const { users } = useUsers();
  const { sessions } = useSessions();

  return useMemo(() => {
    if (!memberId) return null;

    const member = users.find((u) => u.id === memberId);
    if (!member) return null;

    const memberSessions = sessions.filter((s) => s.memberId === memberId);
    
    // --- report.tsx의 useMemberReports 훅과 계산 로직을 완전히 동일하게 맞춤 ---
    const attendedCount = memberSessions.filter(
      (s) => s.status === "completed" || s.status === "late"
    ).length;
    const totalScheduled = memberSessions.filter(
      (s) => s.status === "completed" || s.status === "late" || s.status === "no-show"
    ).length;
    const attendanceRate =
      totalScheduled > 0
        ? Math.round((attendedCount / totalScheduled) * 100)
        : 100;

    // 'late' 상태 대신, 저장된 출석 시간을 기준으로 지각을 다시 계산합니다.
    const latenessCount = memberSessions.filter(
      (s) => s.memberCheckInTime && new Date(s.memberCheckInTime) > new Date(`${s.sessionDate}T${s.sessionTime}`)
    ).length;
    
    const absenceCount = memberSessions.filter(
      (s) => s.status === "no-show"
    ).length;

    const nonComplianceCount = latenessCount + absenceCount;

    const usedPT = totalScheduled; // completed, late, no-show를 모두 사용된 세션으로 간주
    const remainingPT = (member.ptTotalSessions || 0) - usedPT;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyPTSessions = memberSessions.filter(s => {
      const sessionDate = new Date(s.sessionDate);
      return (
        (s.status === 'completed' || s.status === 'late') &&
        sessionDate.getFullYear() === currentYear &&
        sessionDate.getMonth() === currentMonth
      );
    }).length;
    // --- 로직 통일 완료 ---

    const attendanceHistory = memberSessions.map((s: Session) => ({
      date: s.sessionDate,
      status: s.status,
    }));

    const notes = memberSessions
      .filter((s) => s.memo)
      .map((s) => `${s.sessionDate}: ${s.memo}`)
      .join("\n");

    return {
      member,
      stats: { 
        attendanceRate, 
        nonComplianceCount,
        monthlyPTSessions, 
        remainingPT 
      },
      calendar: { attendanceHistory },
      notes,
    };
  }, [memberId, users, sessions]);
};

export default function MemberDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const memberDetails = useMemberDetails(id);

  if (!memberDetails) {
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
            <StatCard label="지각 및 결석" value={stats.nonComplianceCount} unit="회" />
          </View>
          <View style={styles.statCardWrapper}>
            <StatCard label="잔여 PT" value={stats.remainingPT} unit="회" />
          </View>
          <View style={styles.statCardWrapper}>
            <StatCard label="이번달 PT 진행수" value={stats.monthlyPTSessions} unit="회" />
          </View>
        </View>

        <CoachingNotes initialNotes={notes} />

        <AttendanceCalendar
          year={new Date().getFullYear()}
          month={new Date().getMonth() + 1}
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