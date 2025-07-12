import { Session } from "@/constants/mocks";
import { useUsers } from "@/context/UserContext";
import { User } from "@/types";
import { useMemo } from "react";

export const useMemberDashboardData = (
  memberId: string,
  sessions: Session[]
) => {
  const { users } = useUsers();
  const member = useMemo(
    () => users.find((u: User) => u.id === memberId && u.role === "member"),
    [users, memberId]
  );
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
      (s: Session) =>
        s.status === "completed" ||
        s.status === "late" ||
        s.status === "no-show"
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
      .sort((a: Session, b: Session) => {
        const aTime = new Date(`${a.sessionDate}T${a.sessionTime}`).getTime();
        const bTime = new Date(`${b.sessionDate}T${b.sessionTime}`).getTime();
        return aTime - bTime;
      });
    const nextSession = upcomingSessions[0];
    if (!nextSession) return null;
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