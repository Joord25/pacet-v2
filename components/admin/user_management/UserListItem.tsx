import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { TrainerDetails } from "@/hooks/useUserManagement";
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface UserListItemProps {
    trainer: TrainerDetails;
    onToggleStatus: (trainer: TrainerDetails) => void;
}

export const UserListItem: React.FC<UserListItemProps> = ({ trainer, onToggleStatus }) => {
    const status = trainer.status || 'active'; 
    const statusConfig = {
        active: { text: '활동중', color: Colors.pacet.success, bg: Colors.pacet.successMuted },
        inactive: { text: '비활성', color: Colors.pacet.mediumText, bg: Colors.pacet.lightGray },
    };
    const toggleButtonText = status === 'active' ? '비활성화' : '활성화';

    return (
        <View style={styles.container}>
            {/* 트레이너 정보 (아이콘 제거, 왼쪽 정렬) */}
            <View style={[styles.cell, { flex: 2 }]}>
                <ThemedText style={styles.name}>{trainer.name}</ThemedText>
                <ThemedText style={styles.email}>{trainer.email}</ThemedText>
            </View>

            {/* 담당 회원 (왼쪽 정렬) */}
            <ThemedText style={[styles.cell, { flex: 1 }]}>{trainer.assignedMembersCount}명</ThemedText>
            
            {/* 상태 (왼쪽 정렬) */}
            <View style={[styles.cell, { flex: 1.2 }]}>
                <View style={[styles.statusBadge, { backgroundColor: statusConfig[status].bg }]}>
                    <ThemedText style={[styles.statusText, { color: statusConfig[status].color }]}>
                        {statusConfig[status].text}
                    </ThemedText>
                </View>
            </View>
            
            {/* 관리 (왼쪽 정렬) */}
            <View style={[styles.cell, { flex: 1 }]}>
                <TouchableOpacity onPress={() => onToggleStatus(trainer)} style={styles.actionButton}>
                    <ThemedText style={styles.actionButtonText}>{toggleButtonText}</ThemedText>
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
    cell: {
        fontSize: 14,
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
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignSelf: 'flex-start', // 셀 내부에서 왼쪽으로 붙이기
    },
    statusText: { 
        fontSize: 12, 
        fontWeight: 'bold' 
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: '#F1F5F9',
        alignSelf: 'flex-start', // 셀 내부에서 왼쪽으로 붙이기
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#475569',
    }
}); 