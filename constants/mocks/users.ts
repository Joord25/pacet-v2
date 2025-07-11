import type { User } from "@/types";

export const allUsers: User[] = [
  // --- Members ---
  {
    id: "member1",
    email: "member1@test.com",
    password: "password",
    name: "최수빈",
    role: "member",
    ptTotalSessions: 20,
    assignedTrainerId: "trainer1", // 박준호 트레이너
  },
  {
    id: "member2",
    email: "member2@test.com",
    password: "password",
    name: "이정훈",
    role: "member",
    ptTotalSessions: 30,
    assignedTrainerId: "trainer2", // 김창희 트레이너
    status: "active",
  },
  {
    id: "member3",
    email: "member3@test.com",
    password: "password",
    name: "김민지",
    role: "member",
    ptTotalSessions: 10,
    assignedTrainerId: "trainer1", // 박준호 트레이너
    status: "inactive", // 계약 만료 회원으로 설정
  },
  {
    id: "member4",
    email: "member4@test.com",
    password: "password",
    name: "김영희",
    role: "member",
    ptTotalSessions: 50,
    assignedTrainerId: "trainer3", // 심영지 트레이너
    status: "active",
  },

  // --- Trainers ---
  {
    id: "trainer1",
    email: "trainer1@test.com",
    password: "password",
    name: "박준호",
    role: "trainer",
  },
  {
    id: "trainer2",
    email: "trainer2@test.com",
    password: "password",
    name: "김창희",
    role: "trainer",
  },
  {
    id: "trainer3",
    email: "trainer3@test.com",
    password: "password",
    name: "심영지",
    role: "trainer",
  },

  // --- Admin ---
  {
    id: "admin1",
    email: "admin@test.com",
    password: "password",
    name: "임주용",
    role: "admin",
  },
]; 