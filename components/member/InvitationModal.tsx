import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Contract } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface InvitationModalProps {
  invitation: (Contract & { trainerName: string }) | null;
  onAccept: (contractId: string) => void;
  onReject: (contractId: string) => void;
}

export function InvitationModal({
  invitation,
  onAccept,
  onReject,
}: InvitationModalProps) {
  if (!invitation) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Ionicons
            name="mail-open-outline"
            size={48}
            color={Colors.pacet.primary}
            style={{ marginBottom: 16 }}
          />
          <ThemedText style={styles.modalTitle}>
            {invitation.trainerName} 트레이너님의 초대!
          </ThemedText>
          <ThemedText style={styles.modalSubtitle}>
            새로운 PT 계약이 도착했습니다. 수락하시겠습니까?
          </ThemedText>
          <View style={styles.contractInfoBox}>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>총 세션</ThemedText>
              <ThemedText style={styles.infoValue}>
                {invitation.totalSessions}회
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>계약 금액</ThemedText>
              <ThemedText style={styles.infoValue}>
                {invitation.price.toLocaleString()}원
              </ThemedText>
            </View>
          </View>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.rejectButton]}
              onPress={() => onReject(invitation.id)}
            >
              <ThemedText style={[styles.modalButtonText, styles.rejectButtonText]}>
                거절
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.acceptButton]}
              onPress={() => onAccept(invitation.id)}
            >
              <ThemedText style={styles.modalButtonText}>수락</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.light.textMuted,
    textAlign: "center",
    marginBottom: 24,
  },
  contractInfoBox: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.light.textMuted,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalButtonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 99,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: Colors.pacet.primary,
  },
  rejectButton: {
    backgroundColor: "#e5e7eb",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  rejectButtonText: {
    color: Colors.light.text,
  },
}); 