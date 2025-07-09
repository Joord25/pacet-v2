import { ThemedView } from "@/components/ThemedView";
import { MemberReportCard } from "@/components/report/MemberReportCard";
import { ReportListHeader } from "@/components/report/ReportListHeader";
import { TotalSummaryCard } from "@/components/report/TotalSummaryCard";
import { allSessions, allUsers } from "@/constants/mocks";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";

type SortOrder = "default" | "rateDesc" | "rateAsc";

export type MemberReport = {
  id: string;
  name: string;
  attendanceRate: number;
  latenessCount: number;
  absenceCount: number;
  remainingPT: number;
};

// 로그인한 트레이너의 담당 회원 리포트를 생성하는 훅
const useMemberReports = (trainerId: string | undefined): MemberReport[] => {
  return useMemo(() => {
    if (!trainerId) return [];
    const myMembers = allUsers.filter(
      (user) => user.role === "member" && user.assignedTrainerId === trainerId
    );
    return myMembers.map((member) => {
      const memberSessions = allSessions.filter(
        (session) => session.memberId === member.id
      );
      const attendedCount = memberSessions.filter(
        (s) => s.status === "attended" || s.status === "late"
      ).length;
      const totalScheduled = memberSessions.filter(
        (s) => s.status !== "pending" && s.status !== "cancelled"
      ).length;
      const attendanceRate =
        totalScheduled > 0
          ? Math.round((attendedCount / totalScheduled) * 100)
          : 100;
      const latenessCount = memberSessions.filter(
        (s) => s.status === "late"
      ).length;
      const absenceCount = memberSessions.filter(
        (s) => s.status === "no-show"
      ).length;
      const usedPT = attendedCount;
      const remainingPT = (member.ptTotalSessions || 0) - usedPT;

      return {
        id: member.id,
        name: member.name,
        attendanceRate,
        latenessCount,
        absenceCount,
        remainingPT,
      };
    });
  }, [trainerId]);
};

export default function MemberReportScreen() {
  const { user } = useAuth();
  const initialMemberReports = useMemberReports(user?.id);

  // 🚨 변경점 1: 회원 데이터를 '상태(state)'로 관리하여 업데이트가 가능하도록 함
  const [members, setMembers] = useState<MemberReport[]>([]);
  
  useEffect(() => {
    setMembers(initialMemberReports);
  }, [initialMemberReports]);

  const [sortOrder, setSortOrder] = useState<SortOrder>("rateAsc");
  
  // 🚨 변경점 2: 정렬 로직이 state인 members를 바라보도록 수정
  const sortedMembers = useMemo(() => {
    let newSortedMembers = [...members];
    if (sortOrder === "rateDesc") {
      newSortedMembers.sort((a, b) => b.attendanceRate - a.attendanceRate);
    } else if (sortOrder === "rateAsc") {
      newSortedMembers.sort((a, b) => a.attendanceRate - b.attendanceRate);
    }
    return newSortedMembers;
  }, [sortOrder, members]);

  const totalAttendanceRate = useMemo(() => {
    if (members.length === 0) return 0;
    const totalRate = members.reduce(
      (sum, member) => sum + member.attendanceRate,
      0
    );
    return Math.round(totalRate / members.length);
  }, [members]);

  // 🚨 변경점 3: 수업 횟수를 업데이트하는 함수 정의
  const handleUpdateSessions = (memberId: string, sessionsToAdd: number) => {
    setMembers(currentMembers =>
      currentMembers.map(member => {
        if (member.id === memberId) {
          // 실제 앱에서는 DB의 ptTotalSessions를 업데이트하고 데이터를 다시 불러옵니다.
          // 여기서는 예시로 remainingPT를 직접 수정합니다.
          Alert.alert(
            "수업 추가 완료",
            `${member.name} 회원님에게 ${sessionsToAdd}회 수업이 추가되었습니다.`
          );
          return { ...member, remainingPT: member.remainingPT + sessionsToAdd };
        }
        return member;
      })
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.summaryContainer}>
        <TotalSummaryCard rate={totalAttendanceRate} />
      </View>
      <FlatList
        data={sortedMembers}
        // 🚨 변경점 4: 업데이트 함수를 MemberReportCard에 props로 전달
        renderItem={({ item }) => (
          <MemberReportCard 
            member={item} 
            onAddSessions={handleUpdateSessions} 
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ReportListHeader
            count={members.length}
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