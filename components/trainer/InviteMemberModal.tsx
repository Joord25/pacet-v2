import { ThemedText } from "@/components/ThemedText";
import { commonStyles } from "@/styles/commonStyles";
import React, { useState } from "react";
import {
    Alert,
    Button,
    Modal,
    Platform,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

interface InviteMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onInvite: (email: string, totalSessions: number, price: number) => Promise<boolean>;
}

export function InviteMemberModal({ visible, onClose, onInvite }: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [totalSessions, setTotalSessions] = useState("");
  const [price, setPrice] = useState("");

  const handleInvite = async () => {
    if (!email.trim() || !totalSessions.trim() || !price.trim()) {
      Alert.alert("입력 오류", "모든 필드를 입력해주세요.");
      return;
    }
    const sessionsNum = parseInt(totalSessions, 10);
    const priceNum = parseInt(price, 10);
    if (isNaN(sessionsNum) || isNaN(priceNum) || sessionsNum <= 0 || priceNum <= 0) {
      Alert.alert("입력 오류", "수업 횟수와 가격은 0보다 큰 숫자여야 합니다.");
      return;
    }

    const success = await onInvite(email, sessionsNum, priceNum);
    if (success) {
      onClose();
      // 입력 필드 초기화
      setEmail("");
      setTotalSessions("");
      setPrice("");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ThemedText type="title" style={styles.modalTitle}>
            신규 회원 초대
          </ThemedText>

          <ThemedText style={styles.label}>이메일 주소</ThemedText>
          <TextInput
            style={[commonStyles.input, styles.input]}
            placeholder="회원의 이메일을 입력하세요"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ThemedText style={styles.label}>총 수업 횟수</ThemedText>
          <TextInput
            style={[commonStyles.input, styles.input]}
            placeholder="예: 30"
            value={totalSessions}
            onChangeText={setTotalSessions}
            keyboardType="number-pad"
          />

          <ThemedText style={styles.label}>총 가격 (원)</ThemedText>
          <TextInput
            style={[commonStyles.input, styles.input]}
            placeholder="예: 1500000"
            value={price}
            onChangeText={setPrice}
            keyboardType="number-pad"
          />

          <View style={styles.modalButtonContainer}>
            <Button
              title="취소"
              onPress={onClose}
              color={Platform.OS === "ios" ? "red" : undefined}
            />
            <Button title="초대장 보내기" onPress={handleInvite} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    marginBottom: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
}); 