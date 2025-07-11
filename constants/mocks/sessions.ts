export type SessionStatus =
  | "pending"
  | "confirmed" // 예약 확정 (트레이너가 승인)
  | "completed" // 수업 완료 (양쪽 모두 출석)
  | "member-attended" // 회원만 출석
  | "trainer-attended" // 트레이너만 출석
  | "late" // 지각
  | "cancelled" // 'absent'를 대체하고, '사전 취소'를 의미
  | "no-show"; // '결석' 중에서도 '연락 없는 불참'을 의미

export type CancellationCode =
  | "MEMBER_REQUEST" // 회원이 사전에 요청
  | "MEMBER_NOSHOW" // 회원 연락두절 불참
  | "TRAINER_PERSONAL" // 트레이너 개인 사정
  | "CENTER_ISSUE" // 센터 내부 사정 (기기 고장 등)
  | "OTHER"; // 기타

export interface Session {
  sessionId: string;
  memberId: string;
  trainerId: string;
  sessionDate: string; // YYYY-MM-DD
  sessionTime: string; // HH:MM (24-hour)
  status: SessionStatus;
  cancellationReason?: "member" | "trainer"; // 수업 불발의 책임 소재
  cancellationCode?: CancellationCode; // DB 저장을 위한 구체적인 취소 코드
  memo?: string; // '기타' 사유 또는 트레이너의 간단한 메모
}

// --- 전체 세션 로그 ---
export const allSessions: Session[] = [
  // 트레이너 사정으로 취소된 수업
  {
    sessionId: "session-cancelled-by-trainer",
    memberId: "member1",
    trainerId: "trainer1",
    sessionDate: "2025-06-19",
    sessionTime: "10:00",
    status: "cancelled",
    cancellationReason: "trainer",
    cancellationCode: "TRAINER_PERSONAL",
  },
  // 최수빈(member1)의 수업 기록 (총 20회 등록)
  {
    sessionId: "session6",
    memberId: "member1",
    trainerId: "trainer1",
    sessionDate: "2025-06-18",
    sessionTime: "17:00",
    status: "completed",
  },
]; 