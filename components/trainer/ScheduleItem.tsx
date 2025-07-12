import { ThemedText } from "@/components/ThemedText";
import { CancellationReasonModal } from "@/components/common/CancellationReasonModal";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useSessions } from "@/context/SessionContext";
import { CancellationCode, Session, SessionStatus } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

type TodaySession = Session & { memberName: string };

interface ScheduleItemProps {
  session: TodaySession;
}

const statusInfo: Record<
  SessionStatus,
  { label: string; color: string; backgroundColor: string }
> = {
  requested: {
    label: "승인 대기",
    color: Colors.pacet.warning,
    backgroundColor: Colors.pacet.warningMuted,
  },
  confirmed: {
    label: "예약 확정",
    color: Colors.pacet.info,
    backgroundColor: Colors.pacet.infoMuted,
  },
  completed: {
    label: "수업 완료",
    color: Colors.pacet.success,
    backgroundColor: Colors.pacet.successMuted,
  },
  "member-attended": {
    label: "회원 출석",
    color: Colors.pacet.success,
    backgroundColor: Colors.pacet.successMuted,
  },
  "trainer-attended": {
    label: "트레이너 출석",
    color: Colors.pacet.success,
    backgroundColor: Colors.pacet.successMuted,
  },
  late: {
    label: "지각",
    color: Colors.pacet.warning,
    backgroundColor: Colors.pacet.warningMuted,
  },
  "no-show": {
    label: "불참",
    color: Colors.light.error,
    backgroundColor: Colors.light.errorMuted,
  },
  cancelled: {
    label: "취소됨",
    color: Colors.light.textMuted,
    backgroundColor: Colors.light.gray,
  },
};

const StatusTag = ({ status }: { status: SessionStatus }) => {
  const info = statusInfo[status] || {
    label: "알 수 없음",
    color: Colors.light.textMuted,
    backgroundColor: Colors.light.gray,
  };
  return (
    <View style={[styles.tag, { backgroundColor: info.backgroundColor }]}>
      <ThemedText style={[styles.tagText, { color: info.color }]}>
        {info.label}
      </ThemedText>
    </View>
  );
};

const ActionButtons = ({ session }: ScheduleItemProps) => {
  const { user } = useAuth();
  const { updateSession, cancelSession } = useSessions();

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
  
  const handleMemberCancel = () => {
    Alert.alert(
      "예약 취소",
      "정말로 예약을 취소하시겠습니까? 취소된 예약은 복구할 수 없습니다.",
      [
        {
          text: "예약 취소",
          style: "destructive",
          onPress: () => cancelSession(session.sessionId),
        },
        { text: "닫기", style: "cancel" },
      ]
    );
  };

  const isPastSession =
    new Date() > new Date(`${session.sessionDate}T${session.sessionTime}`);
  
  // 트레이너 역할일 때 버튼 렌더링
  if (user?.role === 'trainer') {
    // 'requested'와 'confirmed' 상태는 아이콘으로 처리되므로 여기서 제외합니다.
    if (session.status === "confirmed" && isPastSession) {
      return (
        <TouchableOpacity
          style={[styles.button, styles.noShowButton]}
          onPress={handleNoShow}
        >
          <ThemedText style={[styles.buttonText, styles.noShowButtonText]}>
            No-Show 처리
          </ThemedText>
        </TouchableOpacity>
      );
    }
  }
  
  // 회원 역할일 때 버튼 렌더링
  if (user?.role === 'member') {
    // 'requested'는 제외하고 'confirmed' 상태일 때만 버튼을 보여줍니다.
    if (session.status === "confirmed" && !isPastSession) {
       return (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleMemberCancel}
          >
            <ThemedText style={[styles.buttonText, styles.cancelButtonText]}>
              {'예약 취소'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      );
    }
  }

  return null;
};

export function ScheduleItem({ session }: ScheduleItemProps) {
  const { memberName, sessionTime, status } = session;
  const { user } = useAuth();
  const { rejectRequest, acceptRequest, updateSession } = useSessions();
  const [isModalVisible, setModalVisible] = useState(false);

  const isPastSession =
    new Date() > new Date(`${session.sessionDate}T${session.sessionTime}`);

  const handleSubmitCancellation = (reason: CancellationCode, memo?: string) => {
    const cancellationReason =
      reason === "MEMBER_REQUEST" || reason === "MEMBER_NOSHOW"
        ? "member"
        : "trainer";

    updateSession(session.sessionId, {
      status: "cancelled",
      cancellationReason,
      cancellationCode: reason,
      memo,
    });
    setModalVisible(false);
  };

  const handleCancelRequest = () => {
    Alert.alert("요청 취소", "정말로 예약 요청을 취소하시겠습니까?", [
      {
        text: "요청 취소",
        style: "destructive",
        onPress: () => rejectRequest(session.sessionId),
      },
      { text: "닫기", style: "cancel" },
    ]);
  };

  const showMemberCancelIcon =
    user?.role === "member" && status === "requested" && !isPastSession;

  const showTrainerActionIcons =
    user?.role === "trainer" && status === "requested" && !isPastSession;
  
  const showTrainerCancelIcon =
    user?.role === "trainer" && status === "confirmed" && !isPastSession;

  // 트레이너인 경우 '님'을 붙이고, 회원이면 그대로 표시
  const displayName = user?.role === 'trainer' ? `${memberName} 님` : memberName;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.details}>
          <ThemedText style={styles.sessionTime} numberOfLines={1}>
            {sessionTime}
          </ThemedText>
          <ThemedText style={styles.memberName} numberOfLines={1}>
            {displayName}
          </ThemedText>
        </View>
        <View style={styles.statusContainer}>
          <StatusTag status={status} />
          {showMemberCancelIcon && (
            <TouchableOpacity
              onPress={handleCancelRequest}
              style={styles.cancelIcon}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color={Colors.light.textMuted}
              />
            </TouchableOpacity>
          )}
          {showTrainerCancelIcon && (
             <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.cancelIcon}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color={Colors.light.textMuted}
              />
            </TouchableOpacity>
          )}
          {showTrainerActionIcons && (
            <View style={styles.trainerActions}>
              <TouchableOpacity
                onPress={() => rejectRequest(session.sessionId)}
                style={styles.actionIcon}
              >
                <Ionicons
                  name="close-circle"
                  size={24}
                  color={Colors.light.error}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => acceptRequest(session.sessionId)}
                style={styles.actionIcon}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Colors.light.success}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <ActionButtons session={session} />
      </View>
       <CancellationReasonModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitCancellation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: 12, // container 내부 아이템들의 간격
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trainerActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  actionIcon: {
    marginLeft: 4,
  },
  cancelIcon: {
    marginLeft: 6,
  },
  details: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionInfoText: {
    fontSize: 16,
    color: Colors.pacet.darkText,
  },
  sessionTime: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.pacet.darkText,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold", // 600 -> bold로 변경하여 더 진하게
    color: Colors.pacet.darkText,
    marginLeft: 16, // 8 -> 16으로 늘려 간격 확장
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  actionsContainer: {
    // 버튼 그룹이 컨테이너의 전체 너비를 차지하도록 설정
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end", // 버튼을 오른쪽으로 정렬
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 36, // 버튼 높이 고정
  },
  confirmButton: {
    backgroundColor: Colors.pacet.primary,
  },
  cancelButton: {
    backgroundColor: Colors.pacet.lightGray,
  },
  noShowButton: {
    backgroundColor: Colors.light.errorMuted,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "white",
  },
  cancelButtonText: {
    color: Colors.pacet.darkText,
  },
  noShowButtonText: {
    color: Colors.light.error,
  },
}); 