import { Colors } from "@/constants/Colors";
import { Session } from "@/constants/mocks";
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
      const date = session.sessionDate;
      if (!marks[date]) {
        marks[date] = { dots: [] };
      }
      marks[date].dots.push({
        key: session.sessionId,
        color:
          session.status === "confirmed" ? Colors.pacet.primary : Colors.pacet.warning,
      });
    });
    
    // Add selected date marking
    const selectedDateKey = selectedDate.split("T")[0];
    marks[selectedDateKey] = {
      ...marks[selectedDateKey],
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
      markingType={"multi-dot"}
      markedDates={markedDates}
    />
  );
}

const calendarTheme = {
  arrowColor: Colors.pacet.primary,
  todayTextColor: Colors.pacet.primary,
}; 