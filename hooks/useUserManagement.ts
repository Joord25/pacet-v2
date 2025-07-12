import { useSessions } from "@/context/SessionContext";
import { useUsers } from "@/context/UserContext";
import { User } from '@/types';
import { useMemo } from "react";

// 화면과 훅에서 공용으로 사용할 타입 정의
export type TrainerDetails = User & {
  assignedMembersCount: number;
  fulfillmentRate: number;
  members: User[];
};

export function useUserManagement(): TrainerDetails[] {
  const { users } = useUsers();
  const { sessions } = useSessions();

  const data = useMemo(() => {
    const trainers = users.filter(u => u.role === 'trainer');
    
    const trainersWithDetails = trainers.map(trainer => {
      const assignedMembers = users.filter(u => u.role === 'member' && u.trainerId === trainer.id);
      const assignedMemberIds = assignedMembers.map(m => m.id);

      const currentMonthIdentifier = `${new Date().getFullYear()}-${new Date().getMonth()}`;
      const currentMonthSessions = sessions.filter(s => 
          assignedMemberIds.includes(s.memberId) &&
          `${new Date(s.sessionDate).getFullYear()}-${new Date(s.sessionDate).getMonth()}` === currentMonthIdentifier
      );
      
      const scheduled = currentMonthSessions.filter(s => s.status !== 'cancelled' && s.status !== 'requested').length;
      const attended = currentMonthSessions.filter(s => 
        s.status === 'completed' || s.status === 'late' || s.status === 'member-attended' || s.status === 'trainer-attended'
      ).length;
      const fulfillmentRate = scheduled > 0 ? Math.round((attended / scheduled) * 100) : 100;

      return {
        ...trainer,
        assignedMembersCount: assignedMembers.length,
        fulfillmentRate,
        members: assignedMembers,
      };
    });

    return trainersWithDetails;
  }, [users, sessions]);

  return data;
} 