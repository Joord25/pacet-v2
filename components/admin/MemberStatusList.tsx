import { commonStyles } from "@/styles/commonStyles";
import { User } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";

type MemberWithStats = User & { remainingSessions: number };

interface MemberStatusListProps {
  members: MemberWithStats[];
}

const MemberStatusItem = ({ member }: { member: MemberWithStats }) => {
  const isInactive = member.status === 'inactive';
  return (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1 }}>
        <ThemedText style={[styles.memberName, isInactive && styles.inactiveText]}>{member.name}</ThemedText>
        <ThemedText style={[styles.memberInfo, isInactive && styles.inactiveText]}>
          잔여 PT: {member.remainingSessions}회
        </ThemedText>
      </View>
      <View style={[styles.statusBadge, isInactive ? styles.inactiveBadge : styles.activeBadge]}>
          <ThemedText style={styles.statusText}>{isInactive ? '만료' : '활성'}</ThemedText>
      </View>
    </View>
  );
};

export function MemberStatusList({ members }: MemberStatusListProps) {
  return (
    <View style={[styles.container, commonStyles.cardShadow]}>
        <ThemedText style={styles.title}>회원 현황</ThemedText>
        <View style={styles.listContainer}>
            {members.map(member => <MemberStatusItem key={member.id} member={member} />)}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    listContainer: {
        gap: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    memberName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    memberInfo: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 99,
    },
    activeBadge: {
        backgroundColor: '#dcfce7', // green-100
    },
    inactiveBadge: {
        backgroundColor: '#e5e7eb', // gray-200
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    inactiveText: {
        color: '#9ca3af', // gray-400
    }
}); 