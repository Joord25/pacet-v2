import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
    Modal,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface BookingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (time: Date) => void;
  selectedDate: string;
  trainerId?: string;
}

export function BookingModal({
  isVisible,
  onClose,
  onConfirm,
}: BookingModalProps) {
  const [time, setTime] = useState(new Date());

  const onChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

  const handleConfirm = () => {
    onConfirm(time);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ThemedText style={styles.modalTitle}>시간 선택</ThemedText>
          
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
            minuteInterval={10}
            style={styles.picker}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <ThemedText style={styles.closeButtonText}>닫기</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <ThemedText style={styles.confirmButtonText}>예약 확정</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    width: Platform.OS === 'ios' ? '100%' : 'auto',
    height: Platform.OS === 'ios' ? 180 : 'auto',
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    elevation: 2,
  },
  closeButton: {
    backgroundColor: Colors.light.gray,
  },
  confirmButton: {
    backgroundColor: Colors.pacet.primary,
  },
  closeButtonText: {
    color: Colors.light.text,
    fontWeight: "bold",
    textAlign: "center",
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: "bold",
    textAlign: "center",
  },
}); 