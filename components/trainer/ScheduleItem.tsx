import { ThemedText } from "@/components/ThemedText";
import { Session, SessionStatus } from "@/constants/mocks";
import { useSessions } from "@/context/SessionContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

// 'TodaySession'은 memberName이 추가된 확장된 세션 타입입니다.
type TodaySession = Session & { memberName: string };

interface ScheduleItemProps {
  session: TodaySession;
}

const statusInfo: Record<
  SessionStatus,
  {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    color: string;
    label: string;
  }
> = {
  confirmed: { icon: "checkmark-circle", color: "#2563eb", label: "예약 확정" },
  attended: { icon: "checkmark-done-circle", color: "#16a34a", label: "출석 완료" },
  late: { icon: "time", color: "#a16207", label: "지각" },
  cancelled: { icon: "close-circle", color: "#525252", label: "취소됨" },
  "no-show": { icon: "alert-circle", color: "#dc2626", label: "회원 불참" },
  pending: { icon: "hourglass", color: "#f97316", label: "승인 대기중" },
};

const MoreActionsMenu = ({ session }: ScheduleItemProps) => {
  const { updateSession } = useSessions();

  const handleCancelSession = () => {
    Alert.alert(
      "예약 취소 사유 선택",
      "이 수업 예약을 왜 취소하시겠습니까? 기록된 내용은 회원에게도 공유됩니다.",
      [
        {
          text: "회원 요청",
          onPress: () =>
            updateSession(session.sessionId, {
              status: "cancelled",
              cancellationReason: "member",
              cancellationCode: "MEMBER_REQUEST",
            }),
        },
        {
          text: "트레이너 개인 사정",
          onPress: () =>
            updateSession(session.sessionId, {
              status: "cancelled",
              cancellationReason: "trainer",
              cancellationCode: "TRAINER_PERSONAL",
            }),
        },
        {
          text: "센터 내부 사정",
          onPress: () =>
            updateSession(session.sessionId, {
              status: "cancelled",
              cancellationReason: "trainer",
              cancellationCode: "CENTER_ISSUE",
            }),
        },
        {
          text: "기타",
           onPress: () =>
            updateSession(session.sessionId, {
              status: "cancelled",
              cancellationReason: "trainer", // 트레이너가 메뉴를 열었으므로 기본값을 trainer로 설정
              cancellationCode: "OTHER",
              memo: "별도 협의된 사유로 취소되었습니다."
            }),
        },
        { text: "닫기", style: "cancel" },
      ]
    );
  };

  const handleNoShow = () => {
    Alert.alert(
      "No-Show 처리",
      "회원님이 예약 시간에 나타나지 않았나요? No-Show로 처리하면 해당 세션은 사용된 것으로 기록됩니다.",
      [
        {
          text: "No-Show 처리",
          style: "destructive",
          onPress: () =>
            updateSession(session.sessionId, {
              status: "no-show",
              cancellationReason: "member",
              cancellationCode: "MEMBER_NOSHOW",
            }),
        },
        { text: "닫기", style: "cancel" },
      ]
    );
  };

  const isPastSession = new Date() > new Date(`${session.sessionDate}T${session.sessionTime}`);

  return (
    <Menu>
      <MenuTrigger>
        <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
      </MenuTrigger>
      <MenuOptions customStyles={{ optionsContainer: { borderRadius: 12, padding: 4 } }}>
        {session.status === "confirmed" && !isPastSession && (
          <MenuOption onSelect={handleCancelSession}>
            <ThemedText style={styles.menuOptionText}>예약 취소</ThemedText>
          </MenuOption>
        )}
        {session.status === "confirmed" && isPastSession && (
          <MenuOption onSelect={handleNoShow}>
            <ThemedText style={[styles.menuOptionText, styles.destructiveText]}>No-Show 처리</ThemedText>
          </MenuOption>
        )}
        <MenuOption disabled>
            <ThemedText style={{padding: 8, color: '#9ca3af'}}>변경 사항 없음</ThemedText>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

export function ScheduleItem({ session }: ScheduleItemProps) {
  const { memberName, sessionTime, status } = session;
  const info = statusInfo[status];

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: info.color }]}>
        <Ionicons name={info.icon} size={24} color="white" />
      </View>
      <View style={styles.details}>
        <ThemedText style={styles.memberName}>{memberName}</ThemedText>
        <ThemedText style={styles.sessionTime}>
          {sessionTime} - {info.label}
        </ThemedText>
      </View>
      <MoreActionsMenu session={session} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 999,
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  memberName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1f2937",
  },
  sessionTime: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 2,
  },
  menuOptionText: {
    padding: 8,
    fontSize: 15,
  },
  destructiveText: {
    color: '#dc2626',
  }
}); 