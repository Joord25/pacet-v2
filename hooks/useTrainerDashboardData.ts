import { useAuth } from '@/context/AuthContext';
import { useContracts } from '@/context/ContractContext';
import { useSessions } from '@/context/SessionContext';
import { useUsers } from '@/context/UserContext';
import { isSameDay, isThisMonth, parseISO } from 'date-fns';
import { useMemo } from 'react';

export const useTrainerDashboardData = () => {
  const { user } = useAuth();
  const { sessions, isDataLoaded: sessionsLoaded } = useSessions();
  // 🚨 BUG FIX: 변수명을 isContractsLoading으로 바꾸고, 로딩 로직을 수정합니다.
  const { contracts, loading: isContractsLoading } = useContracts();
  const { users, isDataLoaded: usersLoaded } = useUsers();

  const trainerId = user?.id;

  const dashboardData = useMemo(() => {
    // 🚨 BUG FIX: !contractsLoaded -> isContractsLoading
    // "로딩이 완료되지 않았거나" OR "로딩 중"일 때 isLoading은 true가 되어야 합니다.
    const isLoading = !sessionsLoaded || isContractsLoading || !usersLoaded || !trainerId;
    if (isLoading) {
      return {
        isLoading: true,
        todayScheduleCount: 0,
        completedScheduleCount: 0,
        monthlyRevenue: 0,
        onTimeRate: 100,
        monthlyCompletedSessions: 0,
        monthlyIssues: 0,
        currentMonth: new Date().getMonth() + 1,
        todaySessions: [],
        trainer: undefined,
      };
    }

    // 1. 오늘 날짜 관련 데이터 필터링
    const now = new Date();
    const todaySessions = sessions.filter(s => 
      s.trainerId === trainerId && isSameDay(parseISO(s.sessionDate), now)
    );
    const completedToday = todaySessions.filter(s => s.status === 'completed').length;

    // 2. 이번 달 관련 데이터 필터링
    const thisMonthSessions = sessions.filter(s => 
      s.trainerId === trainerId && isThisMonth(parseISO(s.sessionDate))
    );
    const thisMonthContracts = contracts.filter(c =>
        c.trainerId === trainerId && c.contractDate && isThisMonth(parseISO(c.contractDate))
    );

    // 3. 월간 매출 계산
    const monthlyRevenue = thisMonthContracts.reduce((sum, contract) => sum + contract.price, 0);

    // 4. 월간 성과 지표 계산
    const monthlyCompleted = thisMonthSessions.filter(s => s.status === 'completed').length;
    const monthlyLates = thisMonthSessions.filter(s => s.status === 'late').length;
    const monthlyNoShows = thisMonthSessions.filter(s => s.status === 'no-show').length;
    
    const monthlyIssues = monthlyLates + monthlyNoShows;
    const totalScheduledThisMonth = thisMonthSessions.length;
    
    const onTimeRate = totalScheduledThisMonth > 0 
      ? Math.round(((totalScheduledThisMonth - monthlyIssues) / totalScheduledThisMonth) * 100)
      : 100;

    // 🚨 `useUsers` 훅을 밖으로 뺐으므로, 여기선 `users` 변수를 바로 사용합니다.
    const trainer = users.find(u => u.id === trainerId);
    
    const todaySessionsWithMemberNames = todaySessions.map(session => {
        const member = users.find(u => u.id === session.memberId);
        return { ...session, memberName: member?.name || '알 수 없음' };
    });

    return {
      isLoading: false,
      todayScheduleCount: todaySessions.length,
      completedScheduleCount: completedToday,
      monthlyRevenue,
      onTimeRate,
      monthlyCompletedSessions: monthlyCompleted,
      monthlyIssues,
      currentMonth: now.getMonth() + 1,
      todaySessions: todaySessionsWithMemberNames,
      trainer,
    };
    // 🚨 users와 usersLoaded를 의존성 배열에 추가
  }, [sessions, contracts, users, trainerId, sessionsLoaded, isContractsLoading, usersLoaded]);

  return dashboardData;
}; 