import { Colors } from '@/constants/Colors';
import { commonStyles } from '@/styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export const UserListHeader = ({ onSearchChange }: { onSearchChange: (text: string) => void }) => {
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.pacet.mediumText} style={styles.searchIcon} />
                <TextInput
                    placeholder="트레이너 이름 또는 이메일로 검색..."
                    style={styles.searchInput}
                    onChangeText={onSearchChange}
                />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 16, // 상단 패딩 조정
        paddingBottom: 16,
        backgroundColor: Colors.pacet.lightBg, // 배경색을 상위 컴포넌트와 맞춤
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 12,
        ...commonStyles.cardShadow,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 44,
        fontSize: 16,
    }
}); 