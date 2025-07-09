import { ThemedText } from "@/components/ThemedText";
import { Session, SessionStatus } from "@/constants/mocks";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface BookingListItemProps {
  session: Session;
  trainerName: string;
}

const statusConfig: Record<
  Exclude<SessionStatus, "cancelled">,
  { label: string; color: string; bgColor: string }
> = {
  confirmed: { label: "예약 확정", color: "#2563eb", bgColor: "#dbeafe" },
  attended: { label: "수업 완료", color: "#16a34a", bgColor: "#dcfce7" },
  late: { label: "지각", color: "#a16207", bgColor: "#fef08a" },
  "no-show": { label: "회원님 불참", color: "#dc2626", bgColor: "#fee2e2" },
  pending: { label: "승인 대기중", color: "#f97316", bgColor: "#ffedd5" },
};

const cancelledStatusConfig = {
  default: { label: "예약 취소됨", color: "#6b7280", bgColor: "#f3f4f6" },
  trainer: { label: "트레이너 취소", color: "#0891b2", bgColor: "#cffafe" },
  member: { label: "요청하신 취소", color: "#6b7280", bgColor: "#f3f4f6" },
};

export function BookingListItem({ session, trainerName }: BookingListItemProps) {
  const { sessionDate, status, cancellationReason } = session;

  let config;
  if (status === "cancelled") {
    config = cancelledStatusConfig[cancellationReason || "default"];
  } else {
    config = statusConfig[status as keyof typeof statusConfig];
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="calendar-outline" size={24} color="#4b5563" />
      </View>
      <View style={styles.detailsContainer}>
        <ThemedText style={styles.dateText}>{sessionDate}</ThemedText>
        <ThemedText style={styles.trainerText}>{trainerName} 트레이너</ThemedText>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
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