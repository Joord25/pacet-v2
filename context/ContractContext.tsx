import { mockContracts } from '@/constants/mocks/contracts'; // 목 데이터 import
import { Contract, Session } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';
import { SessionContext } from './SessionContext';
import { useUsers } from './UserContext';

// 스토리지 키 정의
const CONTRACTS_STORAGE_KEY = '@pacet_contracts';

// Context가 제공할 값들의 타입 정의
interface ContractContextType {
  contracts: Contract[];
  loading: boolean;
  inviteMember: (email: string, totalSessions: number, price: number) => Promise<boolean>;
  reInviteMember: (memberId: string, totalSessions: number, price: number) => Promise<boolean>;
  linkInvitation: (email: string, memberId: string) => void;
  acceptInvitation: (contractId: string) => void;
  rejectInvitation: (contractId: string) => void;
}

// Context 생성
const ContractContext = createContext<ContractContextType | undefined>(undefined);

// Provider 컴포넌트 정의
export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const { user: currentUser } = useAuth();
  const { addUserSessions, assignTrainerToMember } = useUsers(); // assignTrainerToMember 가져오기
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionContext = useContext(SessionContext);

  if (!sessionContext) {
    // 세션 컨텍스트가 없는 경우 로딩 상태나 에러 처리를 할 수 있습니다.
    // 여기서는 간단히 null을 반환하여 렌더링을 막습니다.
    return null;
  }

  const { sessions } = sessionContext;

  const recomputeAndSetContracts = useCallback(async (
    contractsToProcess: Contract[],
    allSessions: Session[]
  ) => {
    const dynamicallyUpdatedContracts = contractsToProcess.map((contract) => {
      // 'completed' 뿐만 아니라 'late', 'no-show'도 사용된 세션으로 카운트해야 합니다.
      const completedCount = allSessions.filter(
        (s) => s.contractId === contract.id && ['completed', 'late', 'no-show'].includes(s.status)
      ).length;
      return {
        ...contract,
        remainingSessions: contract.totalSessions - completedCount,
      };
    });

    setContracts(dynamicallyUpdatedContracts);
    await AsyncStorage.setItem(
      CONTRACTS_STORAGE_KEY,
      JSON.stringify(dynamicallyUpdatedContracts)
    );
  }, []);


  useEffect(() => {
    const loadContracts = async () => {
      try {
        const storedContracts = await AsyncStorage.getItem(CONTRACTS_STORAGE_KEY);
        const contractsToProcess = storedContracts
          ? JSON.parse(storedContracts)
          : mockContracts;

        await recomputeAndSetContracts(contractsToProcess, sessions);

      } catch (e) {
        console.error('Failed to load contracts:', e);
        // 에러 발생 시 목데이터로 복구
        await recomputeAndSetContracts(mockContracts, sessions);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    // sessions 데이터가 준비된 후에 contracts를 로드합니다.
    if (sessionContext.isDataLoaded) {
      loadContracts();
    }
  }, [sessionContext.isDataLoaded, sessions, recomputeAndSetContracts]);

  // 계약 정보가 변경될 때마다 스토리지에 자동 저장
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(contracts));
    }
  }, [contracts, loading]);

  /**
   * 트레이너가 이메일 주소로 회원을 초대하는 함수.
   * 아직 가입하지 않은 사용자에게도 초대를 보낼 수 있다.
   */
  const inviteMember = useCallback(async (email: string, totalSessions: number, price: number): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'trainer') {
      Alert.alert("권한 없음", "트레이너만 회원을 초대할 수 있습니다.");
      return false;
    }
    const pendingInvitation = contracts.find(c =>
      c.invitedEmail?.toLowerCase() === email.toLowerCase() &&
      c.status === 'invited' &&
      c.trainerId === currentUser.id
    );
    if (pendingInvitation) {
      Alert.alert("초대 실패", "이미 해당 이메일로 보낸 초대장이 있습니다.");
      return false;
    }
    const newContract: Contract = {
      id: `contract_${Date.now()}`,
      memberId: null,
      invitedEmail: email,
      trainerId: currentUser.id,
      startDate: '',
      endDate: '',
      totalSessions,
      remainingSessions: totalSessions,
      price,
      status: 'invited',
    };
    setContracts(prev => [...prev, newContract]);
    Alert.alert("초대 성공", `${email} 주소로 초대장을 보냈습니다.`);
    return true;
  }, [contracts, currentUser]); // 의존성 배열에는 currentUser가 포함되어야 합니다.

  /**
   * 트레이너가 기존 회원에게 재등록을 초대하는 함수.
   */
  const reInviteMember = useCallback(async (memberId: string, totalSessions: number, price: number): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'trainer') {
      Alert.alert("권한 없음", "트레이너만 회원을 초대할 수 있습니다.");
      return false;
    }
    const pendingInvitation = contracts.find(c =>
      c.memberId === memberId &&
      c.status === 'invited' &&
      c.trainerId === currentUser.id
    );
    if (pendingInvitation) {
      Alert.alert("초대 실패", "이미 해당 회원에게 보낸 재등록 초대장이 있습니다.");
      return false;
    }
    const newContract: Contract = {
      id: `contract_${Date.now()}`,
      memberId: memberId,
      invitedEmail: null,
      trainerId: currentUser.id,
      startDate: '',
      endDate: '',
      totalSessions,
      remainingSessions: totalSessions,
      price,
      status: 'invited',
    };
    setContracts(prev => [...prev, newContract]);
    Alert.alert("초대 성공", `회원에게 재등록 초대장을 보냈습니다.`);
    return true;
  }, [contracts, currentUser]);

  /**
   * 사용자가 회원가입 시, 해당 이메일로 온 초대가 있는지 확인하고 연결하는 함수.
   */
  const linkInvitation = useCallback((email: string, memberId: string) => {
    setContracts(prev =>
      prev.map(c => {
        if (c.invitedEmail?.toLowerCase() === email.toLowerCase() && c.status === 'invited') {
          return { ...c, memberId: memberId, invitedEmail: null }; // 연결 후 이메일은 null로 변경
        }
        return c;
      })
    );
  }, [contracts]); // contracts 의존성 추가

  /**
   * 회원이 트레이너의 초대를 수락하는 함수.
   */
  const acceptInvitation = useCallback((contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!currentUser || !contract || !contract.trainerId) { // trainerId null 체크 추가
      Alert.alert("오류", "로그인 정보 또는 계약 정보를 찾을 수 없거나, 트레이너가 지정되지 않았습니다.");
      return;
    }

    // 1. 회원의 총 세션 횟수 업데이트
    addUserSessions(currentUser.id, contract.totalSessions);

    // 2. 회원에게 트레이너 할당
    assignTrainerToMember(currentUser.id, contract.trainerId);

    // 3. 계약 상태를 'active'로 변경
    setContracts(prev =>
      prev.map(c => {
        if (c.id === contractId) {
          return {
            ...c,
            status: 'active',
            startDate: new Date().toISOString().split('T')[0], // 오늘 날짜를 시작일로 설정
           };
        }
        return c;
      })
    );
    Alert.alert("초대 수락", "새로운 PT 계약이 시작되었습니다!");
  }, [currentUser, contracts, addUserSessions, assignTrainerToMember]); // 의존성 배열에 추가

  /**
   * 회원이 트레이너의 초대를 거절하는 함수.
   */
  const rejectInvitation = useCallback((contractId: string) => {
    setContracts(prev => prev.filter(c => c.id !== contractId));
    Alert.alert("초대 거절", "초대장이 삭제되었습니다.");
  }, []);


  const value = { contracts, loading, inviteMember, reInviteMember, linkInvitation, acceptInvitation, rejectInvitation };

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
};

// 커스텀 훅 정의
export function useContracts() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContracts must be used within a ContractProvider');
  }
  return context;
} 