import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { commonStyles } from "@/styles/commonStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface MemberActionButtonsProps {
  isInactive: boolean;
}

export function MemberActionButtons({ isInactive }: MemberActionButtonsProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ActionButton
        icon="calendar"
        text="스케줄 관리"
        onPress={() => router.push("/(common)/schedule")}
        isInactive={isInactive}
        style={{ backgroundColor: 'white', borderColor: '#e5e7eb', borderWidth: 1 }}
        textStyle={{ color: Colors.pacet.darkText }}
        iconColor={Colors.pacet.darkText}
      />
      <ActionButton
        icon="bar-chart"
        text="이번달 출결"
        onPress={() => router.push("/(member)/attendance")}
        isInactive={isInactive}
        style={{ backgroundColor: 'white', borderColor: '#e5e7eb', borderWidth: 1 }}
        textStyle={{ color: Colors.pacet.darkText }}
        iconColor={Colors.pacet.darkText}
      />
      <ActionButton
        icon="qr-code"
        text="QR 출석"
        onPress={() => router.push("/(common)/qr-scanner")}
        isInactive={isInactive}
        style={{ backgroundColor: Colors.pacet.primary }}
        textStyle={{ color: 'white' }}
        iconColor='white'
      />
    </View>
  );
}

// 재사용 가능한 버튼 컴포넌트
const ActionButton = ({ icon, text, onPress, isInactive, style, textStyle, iconColor }: any) => (
  <TouchableOpacity
    style={[styles.button, isInactive && styles.disabledButton, style]}
    onPress={onPress}
    disabled={isInactive}
  >
    <Ionicons name={icon} size={20} color={isInactive ? '#9ca3af' : iconColor} />
    <ThemedText style={[styles.buttonText, isInactive && styles.disabledText, textStyle]}>
      {text}
    </ThemedText>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12, // 간격 조정
    marginVertical: 16,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    ...commonStyles.cardShadow,
  },
  buttonText: {
    fontSize: 15, // 폰트 크기 살짝 줄임
    fontWeight: "bold",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#e5e7eb', // gray-200
    borderColor: '#d1d5db', // gray-300
    ...commonStyles.cardShadow,
    borderWidth: 1,
  },
  disabledText: {
    color: '#9ca3af', // gray-400
  }
}); 