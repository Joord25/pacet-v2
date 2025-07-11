import type { MemberReport } from '@/app/(trainer)/report';
import { ThemedText } from "@/components/ThemedText";
import { Colors } from '@/constants/Colors'; // 색상 상수 임포트
import { useUsers } from '@/context/UserContext';
import { commonStyles } from "@/styles/commonStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { AddSessionsModal } from './AddSessionsModal'; // 새로 만든 모달 컴포넌트

// props 타입 정의: 부모로부터 받을 데이터와 함수
type MemberReportCardProps = {
  member: MemberReport;
  onAddSessions: (memberId: string, sessionsToAdd: number) => void;
};

export const MemberReportCard: React.FC<MemberReportCardProps> = ({ member, onAddSessions }) => {
  const router = useRouter();
  const { updateUserStatus } = useUsers();
  const isInactive = member.status === 'inactive';
  const [isModalVisible, setModalVisible] = useState(false);

  // 🚨 추가: 출석률에 따라 프로그레스 바 색상을 결정하는 로직
  const isAttentionRequired = member.attendanceRate < 90;
  const progressBarColor = isAttentionRequired 
    ? Colors.pacet.info // 90% 미만일 때 '정보' 또는 '주의'를 나타내는 색상
    : Colors.pacet.primary; // 90% 이상일 때 주황색 계열

  const handleAddPress = () => {
    setModalVisible(true);
  };

  const handleModalSubmit = (sessions: number) => {
    if (sessions > 0) {
      onAddSessions(member.id, sessions);
    }
    setModalVisible(false);
  };

  const handleToggleStatus = () => {
    const newStatus = isInactive ? 'active' : 'inactive';
    const actionText = isInactive ? '활성화' : '비활성화';

    Alert.alert(
      `계정 ${actionText}`,
      `'${member.name}' 회원의 계정을 ${actionText}하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { 
          text: actionText, 
          onPress: () => updateUserStatus(member.id, newStatus),
          style: isInactive ? 'default' : 'destructive',
        },
      ]
    );
  };

  return (
    <>
      {/* 🚨 변경: Link 컴포넌트로 페이지 이동 처리 */}
      <TouchableOpacity
        style={[styles.card, commonStyles.cardShadow, isInactive && styles.inactiveCard]}
        onPress={() => router.push(`/(common)/member/${member.id}`)}
        disabled={isInactive}
      >
        <View style={styles.header}>
          <ThemedText style={[styles.name, isInactive && styles.inactiveText]}>{member.name}</ThemedText>
          <Menu>
            <MenuTrigger>
              <Ionicons name="ellipsis-vertical" size={24} color={isInactive ? '#9ca3af' : Colors.pacet.darkText} />
            </MenuTrigger>
            <MenuOptions customStyles={menuStyles}>
              <MenuOption onSelect={handleAddPress} text='세션 추가' />
              <MenuOption onSelect={handleToggleStatus}>
                <ThemedText style={{ color: isInactive ? Colors.pacet.success : Colors.pacet.warning }}>
                  {isInactive ? '계정 활성화' : '계정 비활성화'}
                </ThemedText>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
        <View style={styles.statsContainer}>
          <StatBox
            label="출석률"
            value={member.attendanceRate}
            unit="%"
            isInactive={isInactive}
          />
          <StatBox
            label="지각"
            value={member.latenessCount}
            unit="회"
            isInactive={isInactive}
          />
          <StatBox
            label="결석"
            value={member.absenceCount}
            unit="회"
            isInactive={isInactive}
          />
          <StatBox
            label="잔여 PT"
            value={member.remainingPT}
            unit="회"
            isInactive={isInactive}
          />
        </View>
        
        {/* 🚨 추가: 프로그레스 바 */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${member.attendanceRate}%`, backgroundColor: progressBarColor },
            ]}
          />
        </View>
      </TouchableOpacity>

      <AddSessionsModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        memberName={member.name}
      />
    </>
  );
};

function StatBox({
  label,
  value,
  unit,
  isInactive,
}: {
  label: string;
  value: number;
  unit: string;
  isInactive: boolean;
}) {
  return (
    <View style={styles.statBox}>
      <ThemedText style={[styles.statLabel, isInactive && styles.inactiveText]}>{label}</ThemedText>
      <View style={styles.valueContainer}>
        <ThemedText style={[styles.statValue, isInactive && styles.inactiveText]}>{value}</ThemedText>
        <ThemedText style={[styles.statUnit, isInactive && styles.inactiveText]}>{unit}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  inactiveCard: {
    backgroundColor: '#f3f4f6', // gray-100
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 16,
    borderBottomColor: "#e5e7eb",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
  },
  statBox: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statUnit: {
    fontSize: 14,
    marginLeft: 2,
    marginBottom: 2,
    color: "#6b7280",
  },
  inactiveText: {
    color: '#9ca3af', // gray-400
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb', // gray-200
    borderRadius: 4,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});

const menuStyles = {
  optionsContainer: {
    borderRadius: 12,
    padding: 8,
    marginTop: 30,
  },
}; 