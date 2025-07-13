import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { Modal, StyleSheet, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

type CancellationReason = "MEMBER_REQUEST" | "TRAINER_PERSONAL" | "CENTER_ISSUE" | "OTHER";

interface CancellationReasonModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (reason: CancellationReason, memo?: string) => void;
}

const reasons: { key: CancellationReason, text: string }[] = [
    { key: "MEMBER_REQUEST", text: "회원 요청" },
    { key: "TRAINER_PERSONAL", text: "트레이너 개인 사정" },
    { key: "CENTER_ISSUE", text: "센터 내부 사정" },
    { key: "OTHER", text: "기타" },
];

export function CancellationReasonModal({ isVisible, onClose, onSubmit }: CancellationReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<CancellationReason | null>(null);
  const [memo, setMemo] = useState("");

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason, memo);
      // Reset state after submission
      setSelectedReason(null);
      setMemo("");
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          <ThemedText style={styles.modalTitle}>예약 취소 사유 선택</ThemedText>
          <ThemedText style={styles.modalSubtitle}>기록된 내용은 회원에게도 공유될 수 있습니다.</ThemedText>
          
          <View style={styles.reasonsContainer}>
            {reasons.map(({ key, text }) => (
                <TouchableOpacity
                    key={key}
                    style={[styles.reasonButton, selectedReason === key && styles.selectedReason]}
                    onPress={() => setSelectedReason(key)}
                >
                    <ThemedText style={[styles.reasonText, selectedReason === key && styles.selectedReasonText]}>{text}</ThemedText>
                </TouchableOpacity>
            ))}
          </View>

          {selectedReason === 'OTHER' && (
            <TextInput
              style={styles.memoInput}
              placeholder="기타 사유를 입력하세요..."
              value={memo}
              onChangeText={setMemo}
              multiline
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <ThemedText style={[styles.buttonText, styles.cancelButtonText]}>닫기</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton, !selectedReason && styles.disabledButton]} 
              onPress={handleSubmit}
              disabled={!selectedReason}
            >
              <ThemedText style={[styles.buttonText, styles.submitButtonText, !selectedReason && styles.disabledButtonText]}>확인</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
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
        width: '90%',
        maxWidth: 400,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        alignItems: "stretch",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        marginBottom: 8,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
    modalSubtitle: {
        marginBottom: 24,
        textAlign: "center",
        fontSize: 14,
        color: Colors.light.textMuted,
    },
    reasonsContainer: {
        marginBottom: 16,
    },
    reasonButton: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: Colors.pacet.lightGray,
        marginBottom: 8,
    },
    selectedReason: {
        backgroundColor: Colors.pacet.primary,
        borderColor: Colors.pacet.primary,
        borderWidth: 1,
    },
    reasonText: {
        textAlign: 'center',
        fontWeight: '500',
    },
    selectedReasonText: {
        color: 'white',
    },
    memoInput: {
        borderWidth: 1,
        borderColor: Colors.pacet.border,
        borderRadius: 12,
        padding: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 24,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        borderRadius: 12,
        padding: 16,
        flex: 1,
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: Colors.light.gray,
    },
    submitButton: {
        backgroundColor: Colors.pacet.primary,
    },
    disabledButton: {
        backgroundColor: Colors.pacet.border,
    },
    buttonText: {
        textAlign: "center",
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: Colors.pacet.darkText,
    },
    submitButtonText: {
        color: 'white',
    },
    disabledButtonText: {
        color: Colors.pacet.lightText,
    }
}); 