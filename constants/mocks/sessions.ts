export type SessionStatus =
  | "pending"
  | "confirmed" // 예약 확정 (트레이너가 승인)
  | "attended" // 출석
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
  // 김민지(member3)의 수업 기록 (총 10회 등록)
  {
    sessionId: "session1",
    memberId: "member3",
    trainerId: "trainer1",
    sessionDate: "2025-06-04",
    sessionTime: "18:00",
    status: "late",
    memo: "플랭크 자세 교정",
  },
  {
    sessionId: "session2",
    memberId: "member3",
    trainerId: "trainer1",
    sessionDate: "2025-06-06",
    sessionTime: "18:00",
    status: "attended",
  },
  {
    sessionId: "session3",
    memberId: "member3",
    trainerId: "trainer1",
    sessionDate: "2025-06-11",
    sessionTime: "18:00",
    status: "no-show",
    cancellationReason: "member",
    cancellationCode: "MEMBER_NOSHOW",
    memo: "수업 시간 이후 연락 닿음. 개인 사정으로 불참.",
  },
  {
    sessionId: "session4",
    memberId: "member3",
    trainerId: "trainer1",
    sessionDate: "2025-06-13",
    sessionTime: "18:00",
    status: "late",
  },
  // 예정된 수업
  {
    sessionId: "session5",
    memberId: "member3",
    trainerId: "trainer1",
    sessionDate: "2025-06-18", // 오늘이라고 가정
    sessionTime: "20:00",
    status: "pending",
  },
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
  // 회원이 사전에 요청하여 취소된 수업
  {
    sessionId: "session-cancelled-by-member",
    memberId: "member3",
    trainerId: "trainer1",
    sessionDate: "2025-06-20",
    sessionTime: "11:00",
    status: "cancelled",
    cancellationReason: "member",
    cancellationCode: "MEMBER_REQUEST",
  },

  // 최수빈(member1)의 수업 기록 (총 20회 등록)
  {
    sessionId: "session6",
    memberId: "member1",
    trainerId: "trainer1",
    sessionDate: "2025-06-18",
    sessionTime: "17:00",
    status: "attended",
  },
]; 