import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { TodayMember } from "@/constants/mockData";
import { commonStyles } from "@/styles/commonStyles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface TodayMemberItemProps {
  member: TodayMember;
}

const statusConfig = {
  attended: {
    label: "출석 완료",
    color: Colors.light.success,
    backgroundColor: Colors.light.successMuted,
    opacity: 1,
  },
  pending: {
    label: "예정",
    color: Colors.light.text,
    backgroundColor: Colors.light.gray,
    opacity: 0.6,
  },
  cancelled: {
    label: "취소",
    color: Colors.light.error,
    backgroundColor: Colors.light.errorMuted,
    opacity: 0.8,
  },
};

export function TodayMemberItem({ member }: TodayMemberItemProps) {
  const { name, time, status } = member;
  const config = statusConfig[status];

  return (
    <View
      style={[
        styles.container,
        commonStyles.cardShadow,
        { opacity: config.opacity },
      ]}
    >
      <View style={styles.memberInfo}>
        <View style={styles.iconContainer}>
          <Ionicons name="person" size={24} color={Colors.light.text} />
        </View>
        <View>
          <ThemedText style={styles.memberName}>{name}</ThemedText>
          <ThemedText style={styles.memberTime}>{time}</ThemedText>
        </View>
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
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    backgroundColor: Colors.light.gray,
    padding: 12,
    borderRadius: 999, // Circle
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  memberTime: {
    fontSize: 14,
    color: Colors.light.textMuted,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
}); 