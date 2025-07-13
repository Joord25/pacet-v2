import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Session, SessionStatus } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface BookingListItemProps {
  session: Session;
  trainerName: string;
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


export function BookingListItem({ session, trainerName }: BookingListItemProps) {
  const { sessionDate, sessionTime, status } = session;

  const config = statusInfo[status] || {
    label: "알 수 없음",
    color: Colors.light.textMuted,
    backgroundColor: Colors.light.gray,
  };


  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="calendar-outline" size={24} color="#4b5563" />
      </View>
      <View style={styles.detailsContainer}>
        <ThemedText style={styles.dateText}>{`${sessionDate} · ${sessionTime}`}</ThemedText>
        <ThemedText style={styles.trainerText}>{trainerName} 트레이너</ThemedText>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: config.backgroundColor }]}>
        <ThemedText style={[styles.statusText, { color: config.color }]}>
          {config.label}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 999,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
    gap: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trainerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
}); 