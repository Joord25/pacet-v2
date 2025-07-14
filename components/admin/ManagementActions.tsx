import { Colors } from '@/constants/Colors';
import { commonStyles } from '@/styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

interface ActionRowProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    href?: any;
    onPress?: () => void;
}

const ActionRow: React.FC<ActionRowProps> = ({ icon, label, href, onPress }) => {
    const content = (
        <View style={styles.actionRow}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={20} color={Colors.pacet.primary} />
            </View>
            <ThemedText style={styles.actionLabel}>{label}</ThemedText>
            <Ionicons name="chevron-forward-outline" size={20} color={Colors.pacet.mediumText} />
        </View>
    );

    const commonProps = { activeOpacity: 0.7 };

    if (href) {
        return (
            <Link href={href} asChild>
                <TouchableOpacity {...commonProps}>{content}</TouchableOpacity>
            </Link>
        );
    }
    return (
        <TouchableOpacity onPress={onPress} {...commonProps}>{content}</TouchableOpacity>
    );
};

interface ManagementActionsProps {
    onInviteTrainerPress: () => void;
}

export const ManagementActions: React.FC<ManagementActionsProps> = ({ onInviteTrainerPress }) => {
    return (
        <View style={[styles.card, commonStyles.cardShadow]}>
            <ThemedText type="subtitle" style={styles.title}>핵심 관리 기능</ThemedText>
            <ActionRow 
                icon="people-outline" 
                label="트레이너 관리" 
                href="/(admin)/user-management" 
            />
            <View style={styles.separator} />
            <ActionRow 
                icon="person-add-outline" 
                label="트레이너 초대" 
                onPress={onInviteTrainerPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF7ED', // Light Orange
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#F1F5F9', // Light Gray
        marginHorizontal: 16,
    }
}); 