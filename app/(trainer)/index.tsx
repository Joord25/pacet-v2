import { ThemedText } from "@/components/ThemedText";
import { ActionButtonGroup } from "@/components/trainer/ActionButtonGroup";
import { TodayMemberItem } from "@/components/trainer/ScheduleItem";
import { TrainerSummaryCard } from "@/components/trainer/TrainerSummaryCard";
import { trainerMockData } from "@/constants/mockData";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

export default function TrainerDashboardScreen() {
  const {
    totalClassesToday,
    attendedClassesToday,
    todayMembers,
  } = trainerMockData;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. 헤더: 트레이너 환영 메시지 (제거됨) */}

        {/* 2. 오늘의 요약 카드 */}
        <TrainerSummaryCard
          totalClasses={totalClassesToday}
          attendedClasses={attendedClassesToday}
        />

        {/* 3. 핵심 액션 버튼 그룹 */}
        <ActionButtonGroup />

        {/* 4. 오늘의 수업 목록 */}
        <View>
          <ThemedText style={styles.listTitle}>오늘의 회원님</ThemedText>
          <View style={styles.listContainer}>
            {todayMembers.map((member) => (
              <TodayMemberItem key={member.id} member={member} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb", // gray-50
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6b7280", // gray-500
    marginTop: 4,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listContainer: {
    gap: 12,
  },
}); 