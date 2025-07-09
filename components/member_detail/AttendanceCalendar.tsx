import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { SessionStatus } from "@/constants/mocks";
import { commonStyles } from "@/styles/commonStyles";
import React from "react";
import { StyleSheet, View } from "react-native";

interface AttendanceCalendarProps {
  year: number;
  month: number;
  attendanceHistory: { date: string; status: SessionStatus }[];
}

const statusColors: Record<
  SessionStatus,
  { background: string; text: string }
> = {
  attended: {
    background: Colors.light.successMuted,
    text: Colors.light.success,
  },
  late: {
    background: Colors.pacet.warningMuted,
    text: Colors.pacet.warning,
  },
  "no-show": { // 🚨 'absent'를 'no-show'로 변경하여 데이터와 일치시킴
    background: Colors.light.errorMuted,
    text: Colors.light.error,
  },
  pending: {
    background: Colors.light.gray,
    text: Colors.light.textMuted,
  },
  cancelled: {
    background: "transparent",
    text: Colors.light.textMuted,
  },
};

export function AttendanceCalendar({
  year,
  month,
  attendanceHistory,
}: AttendanceCalendarProps) {
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  const historyMap = new Map(
    attendanceHistory.map((item) => [item.date, item.status])
  );

  const renderCalendarDays = () => {
    const calendarDays = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const status = historyMap.get(dateStr);
      
      if (!status || status === 'cancelled') {
        // 상태가 없거나 '취소'된 경우, 일반 텍스트만 표시
        calendarDays.push(
          <View key={day} style={styles.dayCell}>
            <View style={[styles.dayContainer, { backgroundColor: 'transparent' }]}>
              <ThemedText style={[styles.dayText, { color: statusColors.cancelled.text }]}>
                {day}
              </ThemedText>
            </View>
          </View>
        );
        continue;
      }

      const colors = statusColors[status];

      calendarDays.push(
        <View key={day} style={styles.dayCell}>
          <View style={[styles.dayContainer, { backgroundColor: colors.background }]}>
            <ThemedText style={[styles.dayText, { color: colors.text }]}>
              {day}
            </ThemedText>
          </View>
        </View>
      );
    }
    return calendarDays;
  };

  const LegendItem = ({ label, color }: { label: string, color: string }) => (
    <View style={styles.legendItem}>
      <View style={[styles.legendIndicator, { backgroundColor: color }]} />
      <ThemedText style={styles.legendLabel}>{label}</ThemedText>
    </View>
  );

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{`${year}년 ${month}월 출결 현황`}</ThemedText>
      <View style={[styles.card, commonStyles.cardShadow]}>
        <View style={styles.daysOfWeekContainer}>
          {daysOfWeek.map((day, index) => (
            <ThemedText key={index} style={styles.dayOfWeekText}>
              {day}
            </ThemedText>
          ))}
        </View>
        <View style={styles.calendarGrid}>{renderCalendarDays()}</View>
        <View style={styles.legendContainer}>
            <LegendItem label="출석" color={statusColors.attended.background} />
            <LegendItem label="지각" color={statusColors.late.background} />
            <LegendItem label="결석" color={statusColors['no-show'].background} />
            <LegendItem label="예정" color={statusColors.pending.background} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
    },
    daysOfWeekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    dayOfWeekText: {
        textAlign: 'center',
        width: '14.2%',
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.light.textMuted
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.2%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    dayContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 999, // For circle shape
    },
    dayText: {
        fontSize: 13,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    legendLabel: {
        fontSize: 12,
        color: Colors.light.textMuted,
    },
}); 