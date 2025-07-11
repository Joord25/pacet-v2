import { Colors } from '@/constants/Colors';
import { commonStyles } from '@/styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 👈 useRouter 임포트
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

// 재사용 가능한 액션 버튼
const ActionButton = ({ title, iconName, color, onPress }: { title: string; iconName: any; color: string; onPress: () => void; }) => (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.8}>
        <Ionicons name={iconName} size={20} color="white" style={styles.icon} />
        <ThemedText style={styles.buttonText}>{title}</ThemedText>
    </TouchableOpacity>
);

export const ManagementActions = () => {
  const router = useRouter(); // 👈 훅 사용

  return (
    <View style={[styles.card, commonStyles.cardShadow]}>
      <ThemedText type="subtitle" style={styles.title}>핵심 관리 기능</ThemedText>
      <View style={styles.buttonContainer}>
        <ActionButton 
            title="트레이너/회원 관리" 
            iconName="people"
            color={Colors.pacet.darkBg} // 👈 'dark'를 'darkBg'로 수정
            onPress={() => router.push('/(admin)/user-management')} // �� 페이지 이동
        />
        {/* '신규 수업 등록' 버튼 제거 */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 16,
  },
  buttonContainer: {
    // gap: 12, // 👈 자식 요소가 하나이므로 더 이상 필요 없음
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  icon: {
      marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 