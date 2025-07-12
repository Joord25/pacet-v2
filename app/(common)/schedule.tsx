import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BookingModal } from "@/components/schedule/BookingModal";
import { ScheduleCalendar } from "@/components/schedule/ScheduleCalendar";
import { ScheduleItem } from "@/components/trainer/ScheduleItem";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useContracts } from "@/context/ContractContext";
import { useSessions } from "@/context/SessionContext";
import { useUsers } from "@/context/UserContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { addMinutes, format, isBefore, parseISO, startOfDay } from "date-fns";
import React, { useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

// 불필요한 react-native-calendars import 및 설정 제거

const ListHeader = ({ date }: { date: string }) => (
  <View style={styles.listHeader}>
    <ThemedText style={styles.listHeaderText}>
      {format(parseISO(date), "yy-MM-dd")}
    </ThemedText>
  </View>
);

const TrainerScheduleView = () => {
  const { user } = useAuth();
  const { sessions } = useSessions();
  const { users } = useUsers();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const filteredSessions = useMemo(() => 
    sessions.filter(s => s.trainerId === user?.id && s.status !== 'cancelled'), 
    [sessions, user?.id]
  );

  const selectedDaySessions = useMemo(() => {
    return filteredSessions
      .filter((s) => s.sessionDate === selectedDate)
      .map((session) => ({
        ...session,
        memberName: users.find((u) => u.id === session.memberId)?.name || "알 수 없음",
      }))
      .sort(
        (a, b) =>
          new Date(`${a.sessionDate}T${a.sessionTime}`).getTime() -
          new Date(`${b.sessionDate}T${b.sessionTime}`).getTime()
      );
  }, [filteredSessions, users, selectedDate]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScheduleCalendar 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        sessions={filteredSessions}
      />
      <FlatList
        data={selectedDaySessions}
        renderItem={({ item }) => <ScheduleItem session={item} />}
        keyExtractor={(item) => item.sessionId}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText>선택한 날짜에 예정된 수업이 없습니다.</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
};

// --- 회원 스케줄 뷰 ---
const MemberScheduleView = () => {
  const { user } = useAuth();
  const { sessions, requestSession } = useSessions();
  const { users } = useUsers();
  const { contracts } = useContracts(); // 계약 정보 가져오기
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isBookingModalVisible, setBookingModalVisible] = useState(false);
  
  const filteredSessions = useMemo(() => 
    sessions.filter(s => s.memberId === user?.id && s.status !== 'cancelled'),
    [sessions, user?.id]
  );

  const selectedDaySessions = useMemo(() => {
    return filteredSessions
      .filter((s) => s.sessionDate === selectedDate)
      .map((session) => {
        const trainerName = users.find((u) => u.id === session.trainerId)?.name;
        return {
          ...session,
          memberName: trainerName ? `${trainerName} 트레이너` : "트레이너 정보 없음",
        }
      })
      .sort((a, b) => new Date(`${a.sessionDate}T${a.sessionTime}`).getTime() - new Date(`${b.sessionDate}T${b.sessionTime}`).getTime());
  }, [filteredSessions, users, selectedDate]);

  const handleOpenBookingModal = () => {
    const activeContract = contracts.find(
      (c) => c.memberId === user?.id && c.status === "active"
    );

    if (!activeContract) {
      Alert.alert("오류", "활성화된 PT 계약이 없습니다. 먼저 계약을 진행해주세요.");
      return;
    }
    if ((activeContract.remainingSessions || 0) <= 0) {
      Alert.alert("오류", "남은 세션이 없습니다. 새로운 계약을 진행해주세요.");
      return;
    }
    if (!user?.trainerId) {
      Alert.alert("오류", "담당 트레이너가 지정되지 않았습니다.");
      return;
    }
    
    setBookingModalVisible(true);
  };

  const handleConfirmBooking = (time: Date) => {
    setBookingModalVisible(false);
    
    const activeContract = contracts.find(c => c.memberId === user?.id && c.status === 'active');
    const trainerId = user?.trainerId;

    if (!activeContract || !trainerId) return;

    // 1. 선택된 날짜와 선택된 시간을 합쳐서 새로운 예약의 시작 시간을 생성
    const newBookingStart = new Date(selectedDate);
    newBookingStart.setHours(time.getHours());
    newBookingStart.setMinutes(time.getMinutes());
    
    // 2. 새로운 예약의 종료 시간 계산 (시작 + 50분)
    const newBookingEnd = addMinutes(newBookingStart, 50);

    // 3. 트레이너의 해당 날짜 스케줄 필터링
    const trainerSessionsToday = sessions.filter(
      s => s.trainerId === trainerId && s.sessionDate === selectedDate
    );
    
    // 4. 중복 체크
    const isOverlapping = trainerSessionsToday.some(session => {
      const existingStart = new Date(`${session.sessionDate}T${session.sessionTime}`);
      const existingEnd = addMinutes(existingStart, 50);
      
      // (StartA < EndB) and (EndA > StartB)
      return newBookingStart < existingEnd && newBookingEnd > existingStart;
    });

    if (isOverlapping) {
      Alert.alert("예약 불가", "선택하신 시간은 다른 수업과 겹칩니다. 다른 시간을 선택해주세요.");
      return;
    }

    // 5. 중복이 없으면 예약 요청
    requestSession({
      contractId: activeContract.id,
      memberId: user!.id,
      trainerId: trainerId,
      sessionDate: selectedDate,
      sessionTime: format(newBookingStart, "HH:mm"),
    });

    Alert.alert("요청 완료", "수업 예약이 요청되었습니다. 트레이너의 승인을 기다려주세요.");
  };

  const isPastDate = isBefore(parseISO(selectedDate), startOfDay(new Date()));

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScheduleCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        sessions={filteredSessions}
      />
      <FlatList
        data={selectedDaySessions}
        ListHeaderComponent={<ListHeader date={selectedDate} />}
        renderItem={({ item }) => <ScheduleItem session={item} />}
        keyExtractor={(item) => item.sessionId}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText>선택한 날짜에 예정된 수업이 없습니다.</ThemedText>
          </View>
        }
      />
      <BookingModal
        isVisible={isBookingModalVisible}
        onClose={() => setBookingModalVisible(false)}
        onConfirm={handleConfirmBooking}
        selectedDate={selectedDate}
        trainerId={user?.trainerId}
      />
      {/* --- FAB --- */}
      <TouchableOpacity
        onPress={handleOpenBookingModal}
        style={[styles.fab, isPastDate && styles.fabDisabled]}
        activeOpacity={0.8}
        disabled={isPastDate}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
};


export default function ScheduleScreen() {
  const { user } = useAuth();

  return (
    <ThemedView style={styles.container}>
      {user?.role === "trainer" ? (
        <TrainerScheduleView />
      ) : (
        <MemberScheduleView />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pacet.lightBg,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    padding: 20,
    gap: 12,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  bookingButton: {
    backgroundColor: Colors.pacet.primaryMuted,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  bookingButtonText: {
    color: Colors.pacet.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.pacet.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabDisabled: {
    backgroundColor: Colors.pacet.gray,
  },
  listHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.pacet.lightBg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.pacet.border,
  },
  listHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.pacet.mediumText,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: Colors.pacet.lightGray,
    borderRadius: 6,
    overflow: "hidden", // borderRadius를 적용하기 위해 추가
    alignSelf: "flex-start", // 텍스트 길이에 맞게 배경 조정
  },
}); 