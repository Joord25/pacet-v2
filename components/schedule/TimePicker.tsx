import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

interface TimePickerProps {
  value: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  return (
    <View style={styles.container}>
      <DateTimePicker
        testID="dateTimePicker"
        value={value}
        mode="time"
        is24Hour={true}
        display={Platform.OS === "ios" ? "spinner" : "clock"}
        onChange={onChange}
        minuteInterval={10}
        minimumDate={new Date(new Date().setHours(6, 0, 0, 0))}
        maximumDate={new Date(new Date().setHours(22, 0, 0, 0))}
        style={styles.picker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  picker: {
    width: "100%",
    height: Platform.OS === "ios" ? 180 : "auto",
  },
}); 