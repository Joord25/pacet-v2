import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Session } from "@/constants/mocks";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// 확장된 Session 타입 또는 null을 받을 수 있도록 수정
type UpcomingClass = (Session & { trainerName: string }) | null;

interface UpcomingClassCardProps {
  upcomingClass: UpcomingClass;
}

export function UpcomingClassCard({ upcomingClass }: UpcomingClassCardProps) {
  // `upcomingClass`가 있든 없든 항상 동일한 외부 카드 스타일(`styles.card`)을 사용합니다.
  // 내부 컨텐츠만 조건부로 렌더링합니다.
  return (
    <View style={styles.card}>
      {upcomingClass ? (
        // 1. 다가오는 수업이 있을 때 보여줄 화면
        <>
          <ThemedText style={styles.title}>다가오는 수업</ThemedText>
          <ThemedText style={styles.subtitle}>
            {upcomingClass.trainerName} 트레이너님과의 PT
          </ThemedText>

          <View style={styles.timeInfoBox}>
            <View>
              <ThemedText style={styles.mainTime}>
                {upcomingClass.sessionTime}
              </ThemedText>
              <ThemedText style={styles.date}>
                {upcomingClass.sessionDate}
              </ThemedText>
            </View>
            <View style={styles.departureBox}>
              <ThemedText style={styles.departureLabel}>
                예상 출발 시간
              </ThemedText>
              <ThemedText style={styles.departureTime}>오후 7:15</ThemedText>
            </View>
          </View>

          <View style={styles.transportContainer}>
            <TouchableOpacity style={styles.transportButton}>
              <Ionicons name="walk" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.transportButton}>
              <Ionicons name="train" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.transportButton, styles.activeButton]}
            >
              <Ionicons name="car" size={24} color={Colors.pacet.primary} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // 2. 다가오는 수업이 없을 때 보여줄 화면
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyTitle}>
            다가오는 수업이 없습니다.
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            스케줄 화면에서 다음 수업을 예약해주세요.
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.pacet.primary,
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    // 카드의 최소 높이를 지정하여 내용이 없어도 형태를 유지하도록 합니다.
    minHeight: 258,
    // 내용이 없을 경우에도 중앙 정렬을 위해 추가합니다.
    justifyContent: "center",
  },
  // 'emptyCard' 스타일은 더 이상 필요 없으므로 삭제합니다.

  // 수업이 없을 때 텍스트를 담을 컨테이너 스타일
  emptyContainer: {
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white", // 배경이 주황색이므로 글자색을 흰색으로 변경
  },
  emptySubtitle: {
    color: "white", // 배경이 주황색이므로 글자색을 흰색으로 변경
    opacity: 0.9,
    marginTop: 8,
    textAlign: "center",
  },
  // --- 수업이 있을 때의 스타일 ---
  title: {
    fontWeight: "600",
    fontSize: 18,
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
    marginBottom: 16,
  },
  timeInfoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainTime: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  date: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
  },
  departureBox: {
    alignItems: "center",
  },
  departureLabel: {
    fontSize: 12,
    color: "white",
    opacity: 0.9,
  },
  departureTime: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  transportContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginTop: 20,
  },
  transportButton: {
    padding: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  activeButton: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
}); 