import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import {
  Appointment,
  DailySchedule,
  weeklyScheduleData,
} from "@/constants/mocks";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

function DayCard({ item }: { item: DailySchedule }) {
  const dayOfMonth = new Date(item.date).getDate();
  const cardStyle = [styles.dayCard, item.isToday && styles.todayCard];

  return (
    <View style={cardStyle}>
      <ThemedText
        style={[styles.dayText, item.isToday && styles.todayText]}
      >{`${dayOfMonth} (${item.dayOfWeek})`}</ThemedText>
      <View style={styles.appointmentsContainer}>
        {item.appointments.length > 0 ? (
          item.appointments.map((apt: Appointment) => (
            <View key={apt.time} style={styles.appointmentItem}>
              <ThemedText style={styles.appointmentText}>
                {`${apt.time} ${apt.member}`}
              </ThemedText>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noAppointmentText}>예약 없음</ThemedText>
        )}
      </View>
    </View>
  );
}

export function WeeklyScheduleView() {
  return (
    <ThemedView style={styles.container}>
      {/* 주간 네비게이션 */}
      <View style={styles.weekNavigator}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <ThemedText style={styles.weekTitle}>이번 주 (6/15~6/21)</ThemedText>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {/* 주간 스케줄 리스트 */}
      <FlatList
        data={weeklyScheduleData}
        renderItem={({ item }) => <DayCard item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.listContentContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  weekNavigator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContentContainer: {
    gap: 16,
    paddingHorizontal: (SCREEN_WIDTH * 0.1) / 2, // 양옆 여백 계산
  },
  dayCard: {
    width: SCREEN_WIDTH * 0.8,
    minHeight: 200,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayCard: {
    borderWidth: 2,
    borderColor: Colors.pacet.primary,
  },
  dayText: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 12,
  },
  todayText: {
    color: Colors.pacet.primary,
  },
  appointmentsContainer: {
    flex: 1,
  },
  appointmentItem: {
    backgroundColor: Colors.light.gray,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  appointmentText: {
    textAlign: "center",
    color: Colors.pacet.darkText,
    fontWeight: "500",
  },
  noAppointmentText: {
    textAlign: "center",
    color: Colors.light.textMuted,
    marginTop: "auto",
    marginBottom: "auto",
  },
}); 