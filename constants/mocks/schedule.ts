export interface Appointment {
  time: string; // "10:00"
  member: string; // "최수빈"
  status: "completed" | "upcoming" | "cancelled";
}

export interface DailySchedule {
  id: string; // "2024-06-17"
  date: string;
  dayOfWeek: string; // "월"
  isToday: boolean;
  appointments: Appointment[];
}

export const weeklyScheduleData: DailySchedule[] = [
  {
    id: "2024-06-17",
    date: "2024-06-17",
    dayOfWeek: "월",
    isToday: false,
    appointments: [
      { time: "10:00", member: "최수빈", status: "completed" },
      { time: "11:00", member: "이정훈", status: "completed" },
    ],
  },
  {
    id: "2024-06-18",
    date: "2024-06-18",
    dayOfWeek: "화",
    isToday: true,
    appointments: [
      { time: "14:00", member: "김민지", status: "upcoming" },
      { time: "15:00", member: "김영희", status: "upcoming" },
    ],
  },
  {
    id: "2024-06-19",
    date: "2024-06-19",
    dayOfWeek: "수",
    isToday: false,
    appointments: [],
  },
  {
    id: "2024-06-20",
    date: "2024-06-20",
    dayOfWeek: "목",
    isToday: false,
    appointments: [{ time: "10:00", member: "최수빈", status: "upcoming" }],
  },
  {
    id: "2024-06-21",
    date: "2024-06-21",
    dayOfWeek: "금",
    isToday: false,
    appointments: [],
  },
]; 