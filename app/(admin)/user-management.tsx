import { UserListHeader } from '@/components/admin/user_management/UserListHeader';
import { UserListItem } from '@/components/admin/user_management/UserListItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useUsers } from '@/context/UserContext';
import { TrainerDetails, useUserManagement } from '@/hooks/useUserManagement';
import { commonStyles } from '@/styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

type SortKey = keyof Pick<TrainerDetails, 'name' | 'assignedMembersCount'>;

const SortableHeader = ({ 
    sortKey, 
    currentSort, 
    onSort, 
    label, 
    style 
}: { 
    sortKey: SortKey, 
    currentSort: { key: SortKey; asc: boolean }, 
    onSort: (key: SortKey) => void, 
    label: string, 
    style?: any 
}) => {
    const isActive = sortKey === currentSort.key;
    const iconName = isActive ? (currentSort.asc ? 'arrow-up' : 'arrow-down') : undefined;

    return (
        <TouchableOpacity onPress={() => onSort(sortKey)} style={[styles.headerTouchable, style]}>
            <ThemedText style={styles.headerText}>{label}</ThemedText>
            {iconName && <Ionicons name={iconName} size={14} color={Colors.pacet.darkText} style={styles.sortIcon} />}
        </TouchableOpacity>
    );
};

const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>검색 결과가 없습니다.</ThemedText>
        <ThemedText style={styles.emptySubText}>다른 검색어를 입력해보세요.</ThemedText>
    </View>
)

export default function UserManagementScreen() {
    const allTrainers = useUserManagement();
    const { updateUserStatus } = useUsers();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; asc: boolean }>({ key: 'name', asc: true });

    const handleSort = (key: SortKey) => {
        setSortConfig(prev => {
            if (prev.key === key) return { key, asc: !prev.asc };
            return { key, asc: true };
        });
    };
    
    const handleToggleStatus = (trainer: TrainerDetails) => {
        const newStatus = trainer.status === 'active' ? 'inactive' : 'active';
        Alert.alert(
            `${newStatus === 'active' ? '활성화' : '비활성화'} 확인`,
            `${trainer.name} 트레이너를 ${newStatus === 'active' ? '활성' : '비활성'} 상태로 변경하시겠습니까?`,
            [
                { text: '취소', style: 'cancel' },
                { text: '확인', onPress: () => updateUserStatus(trainer.id, newStatus) }
            ]
        );
    };

    const sortedAndFilteredTrainers = useMemo(() => {
        let items = [...allTrainers];

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            items = items.filter(t => 
                t.name.toLowerCase().includes(lowercasedQuery) || 
                t.email.toLowerCase().includes(lowercasedQuery)
            );
        }
        
        items.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.asc ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.asc ? 1 : -1;
            return 0;
        });

        return items;
    }, [allTrainers, searchQuery, sortConfig]);

    if (!allTrainers) return <ActivityIndicator size="large" style={{ flex: 1}} />

    const TableHeader = () => (
        <View style={styles.tableHeader}>
            <SortableHeader sortKey="name" currentSort={sortConfig} onSort={handleSort} label="트레이너" style={{ flex: 2 }} />
            <SortableHeader sortKey="assignedMembersCount" currentSort={sortConfig} onSort={handleSort} label="담당 회원" style={{ flex: 1 }} />
            <ThemedText style={[styles.headerText, { flex: 1.2 }]}>상태</ThemedText>
            <ThemedText style={[styles.headerText, { flex: 1 }]}>관리</ThemedText>
        </View>
    );

    return (
        <ThemedView style={styles.container}>
            <UserListHeader onSearchChange={setSearchQuery} />
            <View style={styles.listContainer}>
                <FlatList 
                    data={sortedAndFilteredTrainers}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={<TableHeader />}
                    ListEmptyComponent={<EmptyListComponent />}
                    renderItem={({ item }) => <UserListItem trainer={item} onToggleStatus={handleToggleStatus} />}
                    stickyHeaderIndices={[0]}
                    contentContainerStyle={{backgroundColor: 'white', flexGrow: 1}}
                />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', // bg-slate-50
    },
    listContainer: {
        flex: 1,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        ...commonStyles.cardShadow,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F1F5F9', // slate-100
        alignItems: 'center',
    },
    headerText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#475569', // slate-600
        textTransform: 'uppercase',
    },
    // 👇 추가: 비어있을 때 스타일
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: 'white',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#334155',
    },
    emptySubText: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 8,
    },
    headerTouchable: { flexDirection: 'row', alignItems: 'center' },
    sortIcon: { marginLeft: 4, },
}); 