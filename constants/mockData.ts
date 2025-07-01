// 역할별 Mock 데이터 중앙 관리 파일

// 1. 회원 (Member) Mock 데이터
interface MyBooking {
  id: number;
  trainer: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending';
}

export const memberMockData: { myBookings: MyBooking[] } = {
  myBookings: [
    { id: 1, trainer: '김트레이너', date: '2024-07-28', time: '14:00', status: 'confirmed' },
    { id: 2, trainer: '이트레이너', date: '2024-07-29', time: '10:00', status: 'confirmed' },
  ],
};


// 2. 트레이너 (Trainer) Mock 데이터
export interface TodayMember {
  id: number;
  name: string;
  time: string;
  status: 'attended' | 'pending' | 'cancelled';
}

export interface TrainerDashboardData {
  trainerName: string;
  coachingMessage: string;
  totalClassesToday: number;
  attendedClassesToday: number;
  todayMembers: TodayMember[];
}

export const trainerMockData: TrainerDashboardData = {
  trainerName: '박준호',
  coachingMessage: '오늘도 회원님들의 열정을 응원합니다! 💪',
  totalClassesToday: 6,
  attendedClassesToday: 2,
  todayMembers: [
    { id: 1, name: '최수빈', time: '오후 5:00', status: 'attended' },
    { id: 2, name: '이정훈', time: '오후 6:00', status: 'attended' },
    { id: 3, name: '김민지', time: '오후 8:00', status: 'pending' },
    { id: 4, name: '김영희', time: '오후 9:00', status: 'pending' },
  ],
};


// 3. 관리자 (Admin) Mock 데이터
interface TrainerPerformance {
  id: number;
  name: string;
  totalClasses: number;
  attendanceRate: number;
}

export const adminMockData: { trainerPerformances: TrainerPerformance[] } = {
  trainerPerformances: [
    { id: 1, name: '김트레이너', totalClasses: 82, attendanceRate: 95 },
    { id: 2, name: '이트레이너', totalClasses: 75, attendanceRate: 98 },
    { id: 3, name: '박트레이너', totalClasses: 91, attendanceRate: 91 },
  ],
};

// 4. 테스트용 사용자 계정 Mock 데이터
export interface MockUser {
  email: string;
  password?: string; // 실제 앱에서는 비밀번호를 이렇게 저장하지 않습니다.
  role: 'tabs' | 'trainer' | 'admin';
  name: string;
}

export const mockUsers: MockUser[] = [
  { email: 'member@test.com', password: 'password', role: 'tabs', name: '김회원' },
  { email: 'trainer@test.com', password: 'password', role: 'trainer', name: '이트레이너' },
  { email: 'admin@test.com', password: 'password', role: 'admin', name: '박관리' },
]; 