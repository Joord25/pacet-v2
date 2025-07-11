import { useSessions } from '@/context/SessionContext';
import { useUsers } from '@/context/UserContext';
import { useMemo } from 'react';

// 날짜 관련 유틸리티
const getMonthIdentifier = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export const useAdminDashboard = (selectedDate: Date) => {
    const { sessions } = useSessions();
    const { users } = useUsers(); // allUsers 대신 useUsers() 훅 사용

    const data = useMemo(() => {
        const members = users.filter(u => u.role === 'member');
        const trainers = users.filter(u => u.role === 'trainer');
        // --- 1. KPI 계산 ---
        const totalMembers = members.length;
        const totalTrainers = trainers.length;

        const selectedMonthIdentifier = getMonthIdentifier(selectedDate);
        
        const selectedMonthSessions = sessions.filter(s => 
            getMonthIdentifier(new Date(s.sessionDate)) === selectedMonthIdentifier
        );
        
        // --- KPI 계산 로직 수정 ---
        const scheduledInMonth = selectedMonthSessions.filter(s => s.status === 'completed' || s.status === 'late' || s.status === 'no-show').length;
        const attendedInMonth = selectedMonthSessions.filter(s => s.status === 'completed' || s.status === 'late').length;

        const memberAttendanceRate = scheduledInMonth > 0 ? Math.round((attendedInMonth / scheduledInMonth) * 100) : 0;
        
        // 트레이너 약속 이행률 로직 수정
        const trainerCancellationsInMonth = selectedMonthSessions.filter(s => s.status === 'cancelled' && s.cancellationReason === 'trainer').length;
        const totalTrainerSessionsInMonth = selectedMonthSessions.filter(s => trainers.some(t => t.id === s.trainerId)).length;
        
        const trainerFulfillmentRate = totalTrainerSessionsInMonth > 0
          ? Math.round(((totalTrainerSessionsInMonth - trainerCancellationsInMonth) / totalTrainerSessionsInMonth) * 100)
          : 100;

        // --- 2. 트레이너별 이행률 계산 수정 ---
        const trainerPerformanceData = trainers.map(trainer => {
            const trainerSessions = selectedMonthSessions.filter(s => s.trainerId === trainer.id);
            const totalScheduled = trainerSessions.length;
            const cancelledByTrainer = trainerSessions.filter(s => s.status === 'cancelled' && s.cancellationReason === 'trainer').length;
            
            const rate = totalScheduled > 0 ? Math.round(((totalScheduled - cancelledByTrainer) / totalScheduled) * 100) : 100;
            return { name: trainer.name, rate };
        }).sort((a, b) => b.rate - a.rate);


        // --- 3. 월 전체 수업 진행 횟수 계산 (completed 기준) ---
        const totalMonthlySessions = selectedMonthSessions.filter(s => s.status === 'completed').length;


        // --- 4. 회원 현황 목록 데이터 수정 ---
        const membersList = members.map(member => {
            const usedSessions = sessions.filter(s => s.memberId === member.id && (s.status === 'completed' || s.status === 'late' || s.status === 'no-show')).length;
            const remaining = (member.ptTotalSessions || 0) - usedSessions;
            return {
                ...member,
                remainingSessions: remaining > 0 ? remaining : 0,
            }
        });


        // --- 5. 월별 차트 데이터 (기존 로직 유지) ---
        const trainersForChart = users.filter(u => u.role === 'trainer');
        const monthlyProgressData: { [key: string]: any[] } = {
            all: [
                { month: '5월', plan: 80, actual: 95 },
                { month: '6월', plan: 90, actual: 92 },
                { month: '7월 (예상)', plan: 100, actual: 75, isEstimate: true },
            ],
        };

        trainersForChart.forEach((trainer, i) => {
            monthlyProgressData[trainer.id] = [
                { month: '5월', plan: 80, actual: 90 - i * 5 },
                { month: '6월', plan: 90, actual: 85 - i * 5 },
                { month: '7월 (예상)', plan: 100, actual: 70 - i * 5, isEstimate: true },
            ];
        });

        const trainersForPicker = [
            { id: 'all', name: '전체 보기' },
            ...trainersForChart.map(t => ({ id: t.id, name: t.name }))
        ];
        
        return {
            kpi: {
                totalMembers,
                totalTrainers,
                memberAttendanceRate,
                trainerFulfillmentRate,
            },
            trainerPerformance: trainerPerformanceData,
            totalMonthlySessions,
            membersList,
            monthlyProgress: monthlyProgressData, // 👈 확장된 데이터
            trainersForPicker, // 👈 피커에 필요한 트레이너 목록
        };
    }, [selectedDate, sessions, users]);

    return data;
}; 