import type { MemberReport } from '@/app/(trainer)/report';
import { Colors } from '@/constants/Colors'; // 색상 상수 임포트
import { Link } from 'expo-router'; // Link 임포트
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AddSessionsModal } from './AddSessionsModal'; // 새로 만든 모달 컴포넌트

// props 타입 정의: 부모로부터 받을 데이터와 함수
type MemberReportCardProps = {
  member: MemberReport;
  onAddSessions: (memberId: string, sessionsToAdd: number) => void;
};

export const MemberReportCard: React.FC<MemberReportCardProps> = ({ member, onAddSessions }) => {
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

  return (
    <>
      {/* 🚨 변경: Link 컴포넌트로 페이지 이동 처리 */}
      <Link href={{ pathname: '/member/[id]', params: { id: member.id } }} asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <View style={cardStyles.container}>
            <View style={cardStyles.header}>
              <View style={cardStyles.nameContainer}>
                <Text style={cardStyles.name}>{member.name}</Text>
                {isAttentionRequired && (
                  <View style={cardStyles.statusBadge}>
                    <Text style={cardStyles.statusText}>관심 필요</Text>
                  </View>
                )}
              </View>
              <View style={cardStyles.headerRightContainer}>
                <Text style={[cardStyles.rate, { color: progressBarColor }]}>
                  출석률 {member.attendanceRate}%
                </Text>
                <TouchableOpacity onPressIn={(e) => {
                  e.stopPropagation(); // 이벤트 버블링 중단
                  handleAddPress();
                }} style={cardStyles.plusButton}>
                  <Text style={cardStyles.plusButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={cardStyles.body}>
              <View style={cardStyles.infoItem}>
                <Text style={cardStyles.infoLabel}>잔여 PT</Text>
                <Text style={cardStyles.infoValue}>{member.remainingPT}회</Text>
              </View>
              <View style={cardStyles.infoItem}>
                <Text style={cardStyles.infoLabel}>지각</Text>
                <Text style={cardStyles.infoValue}>{member.latenessCount}회</Text>
              </View>
              <View style={cardStyles.infoItem}>
                <Text style={cardStyles.infoLabel}>결석</Text>
                <Text style={cardStyles.infoValue}>{member.absenceCount}회</Text>
              </View>
            </View>
            
            {/* 🚨 추가: 프로그레스 바 */}
            <View style={cardStyles.progressBarContainer}>
              <View
                style={[
                  cardStyles.progressBar,
                  { width: `${member.attendanceRate}%`, backgroundColor: progressBarColor },
                ]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Link>

      <AddSessionsModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        memberName={member.name}
      />
    </>
  );
};

const cardStyles = StyleSheet.create({
    container: { backgroundColor: 'white', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, },
    headerRightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    name: { fontSize: 18, fontWeight: 'bold' },
    rate: { fontSize: 14, color: '#4B5563' },
    statusBadge: {
        backgroundColor: Colors.pacet.infoMuted,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    statusText: {
        color: Colors.pacet.info,
        fontSize: 12,
        fontWeight: 'bold',
    },
    plusButton: {
        backgroundColor: '#F3F4F6',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusButtonText: {
        color: '#374151',
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 22, // 텍스트 수직 정렬
    },
    body: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
    infoItem: { alignItems: 'center' },
    infoLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
    infoValue: { fontSize: 16, fontWeight: '600' },
    
    // 🚨 추가: 프로그레스 바 스타일
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 16,
    },
    progressBar: {
        height: '100%',
    },
}); 