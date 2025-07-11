import { BookingListItem } from "@/components/member/BookingListItem";
import { MemberActionButtons } from "@/components/member/MemberActionButtons";
import { MemberStatsGroup } from "@/components/member/MemberStatsGroup";
import { UpcomingClassCard } from "@/components/member/UpcomingClassCard";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import {
  Session
} from "@/constants/mocks";
import { useAuth } from "@/context/AuthContext";
import { useSessions } from "@/context/SessionContext";
import { useUsers } from "@/context/UserContext";
import { User } from "@/types";
import React, { useMemo } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View
} from "react-native";

// --- 데이터 처리 로직 ---
const useMemberDashboardData = (
  memberId: string,
  sessions: Session[]
) => {
  const { users } = useUsers(); // 🚨 추가: UserContext에서 최신 사용자 목록 가져오기

  const member = useMemo(() => {
    // 🚨 변경: allUsers 대신 context의 users 배열에서 검색
    return users.find(
      (u: User) => u.id === memberId && u.role === "member"
    );
  }, [users, memberId]);
  
  const memberSessions = sessions.filter((s) => s.memberId === memberId);

  const stats = useMemo(() => {
    if (!member || !memberSessions) {
      return { latenessCount: 0, absenceCount: 0, remainingPT: 0 };
    }

    const latenessCount = memberSessions.filter(
      (s: Session) => s.status === "late"
    ).length;
    const absenceCount = memberSessions.filter(
      (s: Session) => s.status === "no-show"
    ).length;
    const usedSessions = memberSessions.filter(
      (s: Session) => s.status === "completed" || s.status === "late" || s.status === "no-show"
    ).length;

    const totalSessions = member.ptTotalSessions || 0;
    const remainingPT = totalSessions - usedSessions;

    return { latenessCount, absenceCount, remainingPT };
  }, [member, memberSessions]);

  const upcomingClass = useMemo(() => {
    const now = new Date();
    const upcomingSessions = memberSessions
      .filter((s: Session) => {
        if (s.status !== "pending" && s.status !== "confirmed") return false;
        const sessionDateTime = new Date(`${s.sessionDate}T${s.sessionTime}`);
        return sessionDateTime > now;
      })
      .sort(
        (a: Session, b: Session) => {
            const aTime = new Date(`${a.sessionDate}T${a.sessionTime}`).getTime();
            const bTime = new Date(`${b.sessionDate}T${b.sessionTime}`).getTime();
            return aTime - bTime;
        }
      );

    const nextSession = upcomingSessions[0];
    if (!nextSession) return null;

    // 🚨 변경: allUsers 대신 context의 users 배열에서 검색
    const trainer = users.find((u: User) => u.id === nextSession.trainerId);
    return {
      ...nextSession,
      trainerName: trainer?.name || "담당 트레이너",
    };
  }, [memberSessions, users]);

  const bookingHistory = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return [...memberSessions]
      .filter((s: Session) => {
        const sessionDate = new Date(s.sessionDate);
        return (
          sessionDate.getFullYear() === currentYear &&
          sessionDate.getMonth() === currentMonth
        );
      })
      .sort((a: Session, b: Session) => {
        const aTime = new Date(`${a.sessionDate}T${a.sessionTime}`).getTime();
        const bTime = new Date(`${b.sessionDate}T${b.sessionTime}`).getTime();
        return bTime - aTime;
      });
  }, [memberSessions]);

  return { member, stats, upcomingClass, bookingHistory };
};
// --------------------

export default function MemberDashboardScreen() {
  const { user } = useAuth();
  const { sessions } = useSessions();
  const { users } = useUsers(); // 🚨 수정: Hook을 컴포넌트 최상단으로 이동

  const { member, stats, upcomingClass, bookingHistory } = useMemberDashboardData(
    user?.id || "",
    sessions
  );

  if (!member) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>회원 정보를 찾을 수 없습니다.</ThemedText>
      </SafeAreaView>
    );
  }

  const isInactive = member.status === 'inactive';

  const renderBookingItem = ({ item }: { item: Session }) => {
    // 🚨 수정: 이제 Hook 호출 없이 부모 스코프의 users 변수를 사용
    const trainer = users.find((u: User) => u.id === item.trainerId);
    return (
      <BookingListItem
        session={item}
        trainerName={trainer?.name || "담당 트레이너"}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <ThemedText type="title" style={styles.headerTitle}>
                {member.name}님, 안녕하세요!
              </ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                오늘도 목표를 향해 달려볼까요? 🔥
              </ThemedText>
            </View>
            
            {isInactive && (
              <View style={styles.inactiveContainer}>
                <ThemedText style={styles.inactiveTitle}>계약 만료</ThemedText>
                <ThemedText style={styles.inactiveText}>
                  모든 세션이 종료되었습니다. 재등록을 원하시면 센터에 문의해주세요.
                </ThemedText>
              </View>
            )}

            <UpcomingClassCard upcomingClass={upcomingClass} />

            <MemberActionButtons isInactive={isInactive} />

            <MemberStatsGroup
              remainingPT={stats.remainingPT}
              latenessCount={stats.latenessCount}
              absenceCount={stats.absenceCount}
            />

            <ThemedText style={styles.listTitle}>최근 수업 기록</ThemedText>
          </>
        }
        data={bookingHistory}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.sessionId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb", // gray-50
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontWeight: "900",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6b7280", // gray-500
    marginTop: 4,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937", // gray-800
    marginBottom: 12,
  },
  inactiveContainer: {
    backgroundColor: Colors.pacet.warningMuted,
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: Colors.pacet.warning,
  },
  inactiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.pacet.warning,
    marginBottom: 4,
  },
  inactiveText: {
    fontSize: 14,
    color: Colors.pacet.darkText,
  },
}); 