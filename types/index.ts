export type UserRole = "member" | "trainer" | "admin";

export interface User {
  id: string; // 'member1', 'trainer1' 등 고유 ID
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  status?: "active" | "inactive"; // 회원 상태 (활성/비활성)
  profileImageUrl?: string; // 프로필 이미지 URL
  // --- Member-specific fields ---
  ptTotalSessions?: number; // 🚨 타입을 number로 변경하여 세션 추가/계산이 가능하도록 수정
  trainerId?: string; // 담당 트레이너 ID (회원에게만 해당)
}

export type ContractStatus = 'active' | 'completed' | 'invited' | 'cancelled';

export interface Contract {
  id: string;
  memberId: string | null;
  invitedEmail: string | null;
  trainerId: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  remainingSessions: number;
  price: number;
  status: ContractStatus;
}

export type SessionStatus =
  | 'requested' // 회원이 예약 요청
  | 'confirmed' // 예약 확정
  | 'completed' // 출석 완료
  | 'cancelled' // 예약 취소
  | 'no-show'   // 노쇼
  | 'member-attended' // 회원만 출석
  | 'trainer-attended' // 트레이너만 출석
  | 'late'; // 지각

export type CancellationCode =
  | "MEMBER_REQUEST" // 회원이 사전에 요청
  | "MEMBER_NOSHOW" // 회원 연락두절 불참
  | "TRAINER_PERSONAL" // 트레이너 개인 사정
  | "CENTER_ISSUE" // 센터 내부 사정 (기기 고장 등)
  | "OTHER"; // 기타

export interface Session {
  sessionId: string;
  contractId: string;
  memberId: string;
  trainerId:string;
  sessionDate: string; // 'YYYY-MM-DD'
  sessionTime: string; // 'HH:MM'
  status: SessionStatus;
  memo?: string;
  cancellationReason?: "member" | "trainer"; // 🚨 취소 관련 속성 추가
  cancellationCode?: CancellationCode; // 🚨 취소 관련 속성 추가
  memberCheckInTime?: string; // 회원의 실제 출석체크 시간 (ISO 8601)
  trainerCheckInTime?: string; // 트레이너의 실제 출석체크 시간 (ISO 8601)
} 