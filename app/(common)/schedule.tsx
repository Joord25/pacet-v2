import { ThemedText } from "@/components/ThemedText";
import { BookingListItem } from "@/components/member/BookingListItem";
import { BookingRequestItem } from "@/components/schedule/BookingRequestItem";
import { ScheduleCalendar } from "@/components/schedule/ScheduleCalendar";
import { ScheduleItem } from "@/components/trainer/ScheduleItem";
import { Colors } from "@/constants/Colors";
import { allUsers } from "@/constants/mocks";
import { useAuth } from "@/context/AuthContext";
import { useSessions } from "@/context/SessionContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";

// --- 데이터 처리 로직 ---
const useMemberSchedule = (memberId: string) => {
  const { sessions } = useSessions();
  const memberSessions = useMemo(
    () => sessions.filter((s) => s.memberId === memberId),
    [sessions, memberId]
  );
  return { memberSessions };
};

const useTrainerSchedule = (trainerId: string) => {
  const { sessions } = useSessions();

  const trainerSessions = useMemo(
    () => sessions.filter((s) => s.trainerId === trainerId),
    [sessions, trainerId]
  );

  const pendingRequests = useMemo(
    () =>
      trainerSessions
        .filter((s) => s.status === "pending")
        .map((session) => {
          const member = allUsers.find((u) => u.id === session.memberId);
          return { ...session, memberName: member?.name || "N/A" };
        }),
    [trainerSessions]
  );

  return { pendingRequests, trainerSessions };
};
// --------------------

const NewBookingModal = ({
  visible,
  onClose,
  onBook,
  selectedDate,
}: {
  visible: boolean;
  onClose: () => void;
  onBook: (time: Date) => void;
  selectedDate: Date;
}) => {
  const [time, setTime] = useState(() => {
    const newTime = new Date(selectedDate);
    newTime.setHours(9, 0, 0, 0);
    return newTime;
  });

  // selectedDate가 변경될 때마다 time 상태를 업데이트합니다.
  useEffect(() => {
    const newTime = new Date(selectedDate);
    newTime.setHours(9, 0, 0, 0);
    setTime(newTime);
  }, [selectedDate]);

  const handleBookingRequest = () => {
    onBook(time);
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>
            {format(selectedDate, "M월 d일")}
          </ThemedText>
          <ThemedText style={styles.modalSubtitle}>
            수업 시간을 선택해주세요.
          </ThemedText>

          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={(e, newTime) => newTime && setTime(newTime)}
            style={{ width: '100%' }}
          />

          <TouchableOpacity
            style={styles.bookingButton}
            onPress={handleBookingRequest}
          >
            <ThemedText style={styles.bookingButtonText}>
              {format(time, "HH:mm")} 예약 요청
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ThemedText style={styles.closeButtonText}>닫기</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function ScheduleScreen() {
  const { user } = useAuth();
  const { addSession } = useSessions();

  const { memberSessions } = useMemberSchedule(user?.id || "");
  const { pendingRequests, trainerSessions } = useTrainerSchedule(user?.id || "");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isBookingModalVisible, setBookingModalVisible] = useState(false);

  const handleBookNewSession = (time: Date) => {
    if (!user || user.role !== "member") return;
    addSession({
      memberId: user.id,
      trainerId: "trainer1", // TODO: 트레이너 선택 기능 필요
      sessionDate: format(selectedDate, "yyyy-MM-dd"),
      sessionTime: format(time, "HH:mm"),
    });
    setBookingModalVisible(false);
  };

  const renderContent = () => {
    if (user?.role === "trainer") {
      const sessionsForDay = trainerSessions
        .filter((s) => s.sessionDate === format(selectedDate, "yyyy-MM-dd"))
        .sort(
          (a, b) =>
            new Date(`${a.sessionDate}T${a.sessionTime}`).getTime() -
            new Date(`${b.sessionDate}T${b.sessionTime}`).getTime()
        )
        .map((session) => ({
          ...session,
          memberName:
            allUsers.find((u) => u.id === session.memberId)?.name || "알수없음",
        }));

      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* --- 1. 새로운 예약 요청 카드 --- */}
          <View style={styles.cardContainer}>
            <ThemedText style={styles.cardTitle}>
              새로운 예약 요청 ({pendingRequests.length})
            </ThemedText>
            <FlatList
              data={pendingRequests}
              renderItem={({ item }) => <BookingRequestItem request={item} />}
              keyExtractor={(item) => item.sessionId}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.requestsListContainer}
              ListEmptyComponent={
                <ThemedText style={styles.emptyText}>
                  새로운 예약 요청이 없습니다.
                </ThemedText>
              }
            />
          </View>

          {/* --- 2. 내 스케줄 관리 카드 --- */}
          <View style={styles.cardContainer}>
            <ThemedText style={styles.cardTitle}>내 스케줄 관리</ThemedText>
            <ScheduleCalendar
              selectedDate={selectedDate.toISOString()}
              onDateSelect={(date) => setSelectedDate(new Date(date))}
              sessions={trainerSessions}
            />
            <ThemedText style={styles.listTitle}>
              {format(selectedDate, "M월 d일")} 수업
            </ThemedText>
            {sessionsForDay.length > 0 ? (
              <View style={styles.dailyListContainer}>
                {sessionsForDay.map((item) => (
                  <ScheduleItem key={item.sessionId} session={item} />
                ))}
              </View>
            ) : (
              <ThemedText style={styles.emptyText}>
                선택한 날짜에 예정된 수업이 없습니다.
              </ThemedText>
            )}
          </View>
        </ScrollView>
      );
    }

    if (user?.role === "member") {
      // 회원 뷰
      const upcomingSessions = memberSessions
        .filter((s) => s.status === 'confirmed' || s.status === 'pending')
        .sort((a,b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());

      return (
        <View style={styles.memberContainer}>
          <ScheduleCalendar
            selectedDate={selectedDate.toISOString()}
            onDateSelect={(date) => setSelectedDate(new Date(date))}
            sessions={memberSessions}
          />

          <ThemedText style={styles.listTitle}>예약된 수업</ThemedText>
          <FlatList
            data={upcomingSessions}
            renderItem={({ item }) => (
              <BookingListItem
                session={item}
                trainerName={
                  allUsers.find((u) => u.id === item.trainerId)?.name || "알수없음"
                }
              />
            )}
            keyExtractor={(item) => item.sessionId}
            ListEmptyComponent={
              <ThemedText style={styles.emptyText}>
                예정된 수업이 없습니다.
              </ThemedText>
            }
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        {renderContent()}

        {user?.role === "member" && (
          <>
            <TouchableOpacity
              style={styles.fab}
              onPress={() => setBookingModalVisible(true)}
            >
              <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>

            <NewBookingModal
              visible={isBookingModalVisible}
              onClose={() => setBookingModalVisible(false)}
              onBook={handleBookNewSession}
              selectedDate={selectedDate}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContentContainer: {
    padding: 16,
    gap: 16,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  dailyListContainer: {
    gap: 12,
    marginTop: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    paddingHorizontal: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#6b7280",
  },
  requestsContainer: {
    // 이 스타일은 이제 cardContainer로 대체되거나 일부만 사용됩니다.
  },
  requestsTitle: {
    // 이 스타일은 이제 cardTitle로 대체됩니다.
    fontSize: 18,
  },
  requestsListContainer: {
    gap: 12,
  },
  pickerContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  actionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  bookingButton: {
     padding: 16,
     backgroundColor: Colors.pacet.primary,
     borderRadius: 12,
     alignItems: 'center',
  },
  bookingButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  memberContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f97316', // orange-500
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  safeArea: {
    flex: 1,
  },
  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
    marginBottom: 24,
  },
  closeButton: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  closeButtonText: {
    color: "#6b7280",
    fontSize: 16,
  },
}); 