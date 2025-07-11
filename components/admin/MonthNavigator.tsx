import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";

interface MonthNavigatorProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MonthNavigator({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: MonthNavigatorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrevMonth} style={styles.arrowButton}>
        <Ionicons name="chevron-back" size={28} color="#4b5563" />
      </TouchableOpacity>
      <ThemedText style={styles.monthText}>
        {format(currentDate, "yyyy년 M월", { locale: ko })}
      </ThemedText>
      <TouchableOpacity onPress={onNextMonth} style={styles.arrowButton}>
        <Ionicons name="chevron-forward" size={28} color="#4b5563" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: 'white',
    paddingVertical: 8,
    borderRadius: 99,
    alignSelf: 'center',
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  arrowButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    minWidth: 150,
  },
}); 