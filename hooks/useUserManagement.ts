import { useSessions } from "@/context/SessionContext";
import { useUsers } from "@/context/UserContext";
import { User } from '@/types';
import { useMemo } from "react";

// 화면과 훅에서 공용으로 사용할 타입 정의
export type TrainerDetails = User & {
  assignedMembersCount: number;
  members: User[];
};

export function useUserManagement(): TrainerDetails[] {
  const { users } = useUsers();
  const { sessions } = useSessions();

  const data = useMemo(() => {
    const trainers = users.filter(u => u.role === 'trainer');
    
    const trainersWithDetails = trainers.map(trainer => {
      const assignedMembers = users.filter(u => u.role === 'member' && u.trainerId === trainer.id);

      return {
        ...trainer,
        assignedMembersCount: assignedMembers.length,
        members: assignedMembers,
      };
    });

    return trainersWithDetails;
  }, [users, sessions]);

  return data;
} 