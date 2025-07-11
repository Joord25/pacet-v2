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
  ptTotalSessions?: 10 | 20 | 30 | 50;
  assignedTrainerId?: string; // 담당 트레이너 ID
} 