import { useSessions } from '@/context/SessionContext';
import { useUsers } from '@/context/UserContext';
import { Session, User } from '@/types';
import { differenceInMinutes, parseISO } from 'date-fns';
import { useMemo } from 'react';

// 월 식별자 생성 (예: '2025-07')
const getMonthIdentifier = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export interface Violation extends Session {
  memberName: string;
  violationType: 'late' | 'cancelled';
  lateMinutes?: number;
}

export const useTrainerReport = (trainerId: string | undefined, month: string | undefined) => {
  const { sessions, isLoading: sessionsLoading } = useSessions();
  const { users, isLoading: usersLoading } = useUsers();

  const reportData = useMemo(() => {
    if (!trainerId || !month || sessionsLoading || usersLoading) {
      return {
        summary: {
          fulfillmentRate: 0,
          lateCount: 0,
          cancelledCount: 0,
        },
        violations: [],
      };
    }

    const memberMap = new Map<string, User>(users.filter(u => u.role === 'member').map(m => [m.id, m]));
    
    // 1. 선택된 월의 해당 트레이너 세션 필터링
    const trainerSessionsForMonth = sessions.filter(s => {
      return s.trainerId === trainerId && getMonthIdentifier(new Date(s.sessionDate)) === month;
    });

    // 2. 지각 및 취소 세션 필터링
    const lateSessions = trainerSessionsForMonth.filter(s => 
      s.trainerCheckInTime &&
      new Date(s.trainerCheckInTime) > new Date(`${s.sessionDate}T${s.sessionTime}`)
    );

    const cancelledSessions = trainerSessionsForMonth.filter(
      s => s.status === 'cancelled' && s.cancellationReason === 'trainer'
    );
    
    const totalViolations = lateSessions.length + cancelledSessions.length;
    const totalScheduled = trainerSessionsForMonth.length;
    const fulfillmentRate = totalScheduled > 0 
      ? Math.round(((totalScheduled - totalViolations) / totalScheduled) * 100) 
      : 100;

    // 3. 위반 내역 상세 데이터 가공
    const violations: Violation[] = [
      ...lateSessions.map(s => ({
        ...s,
        memberName: memberMap.get(s.memberId)?.name || '알 수 없는 회원',
        violationType: 'late' as const,
        lateMinutes: s.trainerCheckInTime ? differenceInMinutes(
          parseISO(s.trainerCheckInTime), 
          new Date(`${s.sessionDate}T${s.sessionTime}`)
        ) : 0,
      })),
      ...cancelledSessions.map(s => ({
        ...s,
        memberName: memberMap.get(s.memberId)?.name || '알 수 없는 회원',
        violationType: 'cancelled' as const,
      })),
    ].sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());


    return {
      summary: {
        fulfillmentRate,
        lateCount: lateSessions.length,
        cancelledCount: cancelledSessions.length,
      },
      violations,
    };
  }, [trainerId, month, sessions, users, sessionsLoading, usersLoading]);

  return { ...reportData, isLoading: sessionsLoading || usersLoading };
}; 