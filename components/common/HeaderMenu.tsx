import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ThemedText";
import type { IconSymbolName } from "../ui/IconSymbol";
import { IconSymbol } from "../ui/IconSymbol";


interface HeaderMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function HeaderMenu({ visible, onClose }: HeaderMenuProps) {
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  const menuItems: {
    label: string;
    icon: IconSymbolName;
    action: () => void;
  }[] = [
    {
      label: "계정 정보",
      icon: "person.circle",
      action: () => router.push("/(common)/member/some-id"), // TODO: 실제 멤버 ID로 변경
    },
    {
      label: "개선 요청하기",
      icon: "bubble.left.and.bubble.right",
      action: () => Alert.alert("개선 요청", "준비 중인 기능입니다."),
    },
    {
      label: "설정",
      icon: "gearshape",
      action: () => Alert.alert("설정", "준비 중인 기능입니다."),
    },
  ];

  const handleMenuItemPress = (action: () => void) => {
    onClose();
    // 작은 딜레이를 주어 팝오버가 닫힌 후 액션을 실행
    setTimeout(action, Platform.OS === "ios" ? 150 : 0);
  };

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
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item.action)}
              >
                <ThemedText
                  style={[
                    styles.menuItemText,
                  ]}
                >
                  {item.label}
                </ThemedText>
                <IconSymbol
                  name={item.icon}
                  size={18}
                  color="#4b5563"
                />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
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
    top: 90, // 동적으로 계산된 값으로 대체될 예정
    right: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 220,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: "#1f2937",
  },
  separator: {
    height: 1,
    backgroundColor: "#f3f4f6", // gray-100
  },
}); 