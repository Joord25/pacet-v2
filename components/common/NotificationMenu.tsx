import React from "react";
import {
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ThemedText";

interface NotificationMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function NotificationMenu({ visible, onClose }: NotificationMenuProps) {
  const { top } = useSafeAreaInsets();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View
          style={[
            styles.menuContainer,
            { top: top + (Platform.OS === "ios" ? 44 : 56) },
          ]}
        >
          {/* TODO: 실제 알림 목록 렌더링 */}
          <View style={styles.placeholder}>
            <ThemedText style={styles.placeholderText}>
              새로운 알림이 없습니다.
            </ThemedText>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  menuContainer: {
    position: "absolute",
    top: 90,
    right: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 280,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  placeholderText: {
    fontSize: 16,
    color: "#9ca3af", // gray-400
  },
}); 