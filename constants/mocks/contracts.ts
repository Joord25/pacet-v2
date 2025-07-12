import { Contract } from '@/types';

export const mockContracts: Contract[] = [
  // 1. 박준호 트레이너(trainer1)가 최수빈 회원(member1)에게 보낸 초대 상태의 계약
  {
    id: 'contract1',
    memberId: 'member1', 
    invitedEmail: null,
    trainerId: 'trainer1',
    startDate: '2024-05-01',
    endDate: '2024-08-01',
    totalSessions: 30,
    remainingSessions: 30,
    price: 1980000,
    status: 'invited', // 'active'에서 'invited'로 변경
  },
  // 2. 김창희 트레이너(trainer2)가 이정훈 회원(member2)에게 보낸 초대 상태의 계약
  {
    id: 'contract2',
    memberId: 'member2',
    invitedEmail: null,
    trainerId: 'trainer2',
    startDate: '2024-06-15',
    endDate: '2024-09-15',
    totalSessions: 20,
    remainingSessions: 20,
    price: 1320000,
    status: 'invited', // 'active'에서 'invited'로 변경
  },
  // 3. 심영지 트레이너(trainer3)가 김영희 회원(member4)에게 보낸 초대 상태의 계약
  {
    id: 'contract4',
    memberId: 'member4',
    invitedEmail: null,
    trainerId: 'trainer3',
    startDate: '2024-07-01',
    endDate: '2024-10-01',
    totalSessions: 20,
    remainingSessions: 20,
    price: 1320000,
    status: 'invited', // 'active'에서 'invited'로 변경
  },
  // 4. 박준호 트레이너(trainer1)가 이철수(미가입)에게 초대를 보낸 계약 (변경 없음)
  {
    id: 'contract3_invited',
    memberId: null,
    invitedEmail: 'chulsoo@example.com',
    trainerId: 'trainer1',
    startDate: '',
    endDate: '',
    totalSessions: 25,
    remainingSessions: 25,
    price: 1300000,
    status: 'invited',
  },
   // 5. lim2020v@gmail.com 관련 초대 데이터 삭제
  // 6. 박준호 트레이너(trainer1)가 김민지 회원(member3)에게 보낸 신규 초대
  {
    id: 'contract5_invited',
    memberId: 'member3',
    invitedEmail: null,
    trainerId: 'trainer1',
    startDate: '',
    endDate: '',
    totalSessions: 10,
    remainingSessions: 0,
    price: 770000,
    status: 'invited',
  },
  // 6번, 7번 데이터 삭제
]; 