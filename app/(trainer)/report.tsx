import { ThemedView } from "@/components/ThemedView";
import { MemberReportCard } from "@/components/report/MemberReportCard";
import { ReportListHeader } from "@/components/report/ReportListHeader";
import { TotalSummaryCard } from "@/components/report/TotalSummaryCard";
import { useAuth } from "@/context/AuthContext";
import { useSessions } from "@/context/SessionContext";
import { useUsers } from "@/context/UserContext";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";

type SortOrder = "default" | "rateDesc" | "rateAsc";

export type MemberReport = {
  id: string;
  name: string;
  status?: "active" | "inactive";
  attendanceRate: number;
  latenessCount: number;
  absenceCount: number;
  remainingPT: number;
  needsAttention: boolean; // 🚨 '관심 요망' 상태를 위한 필드 추가
};

// 로그인한 트레이너의 담당 회원 리포트를 생성하는 훅
const useMemberReports = (trainerId: string | undefined): MemberReport[] => {
  const { users } = useUsers();
  const { sessions } = useSessions();

  return useMemo(() => {
    if (!trainerId) return [];
    const myMembers = users.filter(
      (user) => user.role === "member" && user.trainerId === trainerId
    );
    return myMembers.map((member) => {
      const memberSessions = sessions.filter(
        (session) => session.memberId === member.id
      );
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
      
      const needsAttention = attendanceRate < 90; // 출석률 90% 미만 시 '관심 요망'

      // 'late' 상태 대신, 저장된 출석 시간을 기준으로 지각을 다시 계산합니다.
      const latenessCount = memberSessions.filter(
        (s) => s.memberCheckInTime && new Date(s.memberCheckInTime) > new Date(`${s.sessionDate}T${s.sessionTime}`)
      ).length;

      const absenceCount = memberSessions.filter(
        (s) => s.status === "no-show"
      ).length;
      const usedPT = memberSessions.filter(
        s => s.status === 'completed' || s.status === 'late' || s.status === 'no-show'
      ).length;
      const remainingPT = (member.ptTotalSessions || 0) - usedPT;

      return {
        id: member.id,
        name: member.name,
        status: member.status,
        attendanceRate,
        latenessCount,
        absenceCount,
        remainingPT,
        needsAttention, // 🚨 반환 객체에 추가
      };
    });
  }, [trainerId, users, sessions]);
};

export default function MemberReportScreen() {
  const { user } = useAuth();
  const { addUserSessions } = useUsers();
  const memberReports = useMemberReports(user?.id);

  const [sortOrder, setSortOrder] = useState<SortOrder>("rateAsc");
  
  const sortedMembers = useMemo(() => {
    let newSortedMembers = [...memberReports];
    if (sortOrder === "rateDesc") {
      newSortedMembers.sort((a, b) => b.attendanceRate - a.attendanceRate);
    } else if (sortOrder === "rateAsc") {
      newSortedMembers.sort((a, b) => a.attendanceRate - b.attendanceRate);
    }
    return newSortedMembers;
  }, [sortOrder, memberReports]);

  const totalAttendanceRate = useMemo(() => {
    if (memberReports.length === 0) return 0;
    const totalRate = memberReports.reduce(
      (sum, member) => sum + member.attendanceRate,
      0
    );
    return Math.round(totalRate / memberReports.length);
  }, [memberReports]);

  const handleUpdateSessions = (memberId: string, sessionsToAdd: number) => {
    addUserSessions(memberId, sessionsToAdd);
    Alert.alert(
      "수업 추가 완료",
      `수업 ${sessionsToAdd}회가 성공적으로 추가되었습니다.`
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.summaryContainer}>
        <TotalSummaryCard rate={totalAttendanceRate} />
      </View>
      <FlatList
        data={sortedMembers}
        renderItem={({ item }) => (
          <MemberReportCard 
            member={item} 
            onAddSessions={handleUpdateSessions} 
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ReportListHeader
            count={memberReports.length}
            currentSort={sortOrder}
            onSortChange={setSortOrder}
          />
        }
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16, // 카드 사이 간격
  },
}); 