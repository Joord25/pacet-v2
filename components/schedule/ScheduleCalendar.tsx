import { Colors } from "@/constants/Colors";
import type { Session } from "@/types";
import React, { useMemo } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { DateData } from "react-native-calendars/src/types";

LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";

interface ScheduleCalendarProps {
  selectedDate: string; // YYYY-MM-DD format from toISOString()
  onDateSelect: (dateString: string) => void;
  sessions: Session[];
}

export function ScheduleCalendar({
  selectedDate,
  onDateSelect,
  sessions,
}: ScheduleCalendarProps) {
  const markedDates = useMemo(() => {
    const marks: { [key: string]: any } = {};

    sessions.forEach((session) => {
      // session.status !== 'cancelled' 와 같은 필터링은 사용하는 쪽에서 미리 처리한다고 가정
      marks[session.sessionDate] = { marked: true, dotColor: Colors.pacet.primary };
    });
    
    // 선택된 날짜 마킹
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: Colors.pacet.primary,
      disableTouchEvent: true,
    };

    return marks;
  }, [sessions, selectedDate]);

  return (
    <Calendar
      current={selectedDate}
      onDayPress={(day: DateData) => onDateSelect(day.dateString)}
      monthFormat={"yyyy년 M월"}
      theme={calendarTheme}
      markedDates={markedDates}
    />
  );
}

const calendarTheme = {
  arrowColor: Colors.pacet.primary,
  todayTextColor: Colors.pacet.primary,
}; 