import { AttendanceCalendar } from '@/components/member_detail/AttendanceCalendar';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useSessions } from '@/context/SessionContext';
import { Stack } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function MemberAttendanceScreen() {
  const { user } = useAuth();
  const { sessions } = useSessions();

  const attendanceHistory = useMemo(() => {
    if (!user) return [];

    const memberSessions = sessions.filter(
      (session) => session.memberId === user.id
    );

    return memberSessions.map((s) => ({
      date: s.sessionDate,
      status: s.status,
    }));
  }, [sessions, user]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: '이번달 출결 현황',
          headerStyle: { backgroundColor: Colors.pacet.lightBg },
          headerTintColor: Colors.pacet.darkText,
          headerTitleAlign: 'center',
        }}
      />
      <View style={styles.calendarContainer}>
        <AttendanceCalendar
          year={currentYear}
          month={currentMonth}
          attendanceHistory={attendanceHistory}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pacet.lightBg,
  },
  calendarContainer: {
    padding: 16,
  },
}); 