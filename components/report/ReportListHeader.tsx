import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

type SortOrder = "default" | "rateDesc" | "rateAsc";

interface ReportListHeaderProps {
  count: number;
  currentSort: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

const sortOptions: { key: SortOrder; label: string }[] = [
  { key: "rateDesc", label: "출석률 높은 순" },
  { key: "rateAsc", label: "출석률 낮은 순" },
];

export function ReportListHeader({
  count,
  currentSort,
  onSortChange,
}: ReportListHeaderProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSortSelect = (order: SortOrder) => {
    onSortChange(order);
    setModalVisible(false);
  };

  const currentSortLabel =
    sortOptions.find((opt) => opt.key === currentSort)?.label ||
    "정렬";

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>전체 회원 ({count}명)</ThemedText>
      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText style={styles.sortButtonText}>{currentSortLabel}</ThemedText>
        <Ionicons
          name="chevron-down"
          size={16}
          color={Colors.light.textMuted}
        />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <SafeAreaView style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={styles.modalItem}
                  onPress={() => handleSortSelect(option.key)}
                >
                  <ThemedText>{option.label}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.pacet.border,
    zIndex: 1,
  },
  sortButtonText: {
    fontSize: 12,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    marginTop: 185, 
    marginRight: 16,
    width: 150,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalItem: {
    padding: 12,
  },
}); 