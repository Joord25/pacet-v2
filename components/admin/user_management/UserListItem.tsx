import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { TrainerDetails } from '@/hooks/useUserManagement';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  trainer: TrainerDetails;
}

export const UserListItem: React.FC<Props> = ({ trainer }) => {
  const isRateLow = trainer.fulfillmentRate < 90;
  const rateColor = isRateLow ? Colors.pacet.warning : Colors.pacet.success;
  const status = trainer.status || 'active'; // status가 없을 경우 기본값
  const statusConfig = {
    active: { text: '활성', color: Colors.pacet.success, bg: Colors.pacet.successMuted },
    inactive: { text: '비활성', color: Colors.pacet.mediumText, bg: Colors.pacet.lightGray },
  };

  return (
    <View style={styles.container}>
      {/* 트레이너 정보 */}
      <View style={styles.trainerInfoContainer}>
        <Image 
          source={{ uri: trainer.profileImageUrl || `https://placehold.co/80x80/0A3442/FFFFFF?text=${trainer.name.charAt(0)}` }} 
          style={styles.profileImage} 
        />
        <View style={styles.trainerTextContainer}>
          <ThemedText style={styles.name}>{trainer.name}</ThemedText>
          <ThemedText style={styles.email}>{trainer.email}</ThemedText>
        </View>
      </View>

      {/* 담당 회원 */}
      <ThemedText style={styles.membersCount}>{trainer.assignedMembersCount}명</ThemedText>
      
      {/* 약속 이행률 */}
      <ThemedText style={[styles.fulfillmentRate, { color: rateColor }]}>
        {trainer.fulfillmentRate}%
      </ThemedText>

      {/* 상태 */}
      <View style={[styles.statusBadge, { backgroundColor: statusConfig[status].bg }]}>
        <ThemedText style={[styles.statusText, { color: statusConfig[status].color }]}>
          {statusConfig[status].text}
        </ThemedText>
      </View>
      
      {/* 관리 버튼 */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity>
          <ThemedText style={styles.actionTextPrimary}>수정</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity>
          <ThemedText style={styles.actionTextSecondary}>비활성화</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    trainerInfoContainer: {
        flex: 2.5,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    trainerTextContainer: {
        // 이 컨테이너는 이제 이름과 이메일을 감싸기만 할 뿐,
        // 특별한 스타일이 필요 없습니다.
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    email: {
        fontSize: 12,
        color: '#64748B',
    },
    membersCount: { flex: 1, fontSize: 14 },
    fulfillmentRate: { flex: 1, fontSize: 14, fontWeight: 'bold' }, // 👈 속성 이름 변경
    statusBadge: {
        flex: 1,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 99,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    actionsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16,
    },
    actionTextPrimary: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.pacet.primary,
    },
    actionTextSecondary: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748B',
    },
}); 