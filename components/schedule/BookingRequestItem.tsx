import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useSessions } from "@/context/SessionContext";
import { Session } from "@/types";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

// 이 컴포넌트에서 사용할 확장된 세션 타입
type PendingSession = Session & { memberName: string };

interface BookingRequestItemProps {
  request: PendingSession;
}

export function BookingRequestItem({ request }: BookingRequestItemProps) {
  const { acceptRequest, rejectRequest } = useSessions();
  const { memberName, sessionId } = request;

  const handleConfirm = () => {
    acceptRequest(sessionId);
    Alert.alert("승인 완료", `${memberName}님의 예약을 확정했습니다.`);
  };

  const handleCancel = () => {
    rejectRequest(sessionId);
    Alert.alert("거절 완료", `${memberName}님의 예약을 거절했습니다.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View>
          <ThemedText style={styles.memberText}>{request.memberName}</ThemedText>
          <ThemedText style={styles.dateTimeText}>
            {`${request.sessionDate} ${request.sessionTime}`}
          </ThemedText>
        </View>
        <View style={styles.statusBadge}>
          <ThemedText style={styles.statusText}>대기중</ThemedText>
        </View>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
        >
          <ThemedText style={[styles.buttonText, styles.cancelButtonText]}>
            거절
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleConfirm}
        >
          <ThemedText style={[styles.buttonText, styles.confirmButtonText]}>
            승인
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  memberText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  dateTimeText: {
    color: Colors.light.textMuted,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: Colors.pacet.warningMuted,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  statusText: {
    color: Colors.pacet.warning,
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#2563eb",
  },
  cancelButton: {
    backgroundColor: "#f1f5f9",
  },
  buttonText: {
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "white",
  },
  cancelButtonText: {
    color: "#334155",
  },
}); 