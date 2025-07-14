import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';

const INVITATIONS_STORAGE_KEY = '@pacet-trainer-invitations';

// 초대장 데이터 타입 정의
export interface TrainerInvitation {
  id: string;
  email: string;
  name: string;
  adminId: string;
  status: 'pending';
  createdAt: string;
}

// Context가 제공할 값들의 타입 정의
interface InvitationContextType {
  invitations: TrainerInvitation[];
  loading: boolean;
  inviteTrainer: (email: string, name: string) => Promise<boolean>;
  checkForInvitation: (email: string) => TrainerInvitation | undefined;
  consumeInvitation: (email: string) => Promise<void>;
}

const InvitationContext = createContext<InvitationContextType | undefined>(undefined);

export const InvitationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<TrainerInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        const storedInvitations = await AsyncStorage.getItem(INVITATIONS_STORAGE_KEY);
        if (storedInvitations) {
          setInvitations(JSON.parse(storedInvitations));
        }
      } catch (e) {
        console.error("Failed to load trainer invitations.", e);
      } finally {
        setLoading(false);
      }
    };
    loadInvitations();
  }, []);

  const saveInvitations = async (newInvitations: TrainerInvitation[]) => {
    try {
      setInvitations(newInvitations);
      await AsyncStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(newInvitations));
    } catch (e) {
      console.error("Failed to save trainer invitations.", e);
    }
  };

  const inviteTrainer = useCallback(async (email: string, name: string): Promise<boolean> => {
    if (user?.role !== 'admin') {
      Alert.alert("권한 오류", "관리자만 트레이너를 초대할 수 있습니다.");
      return false;
    }

    if (!name.trim()) {
      Alert.alert("입력 오류", "이름을 입력해주세요.");
      return false;
    }

    const lowerCasedEmail = email.toLowerCase();
    
    // 이메일 유효성 검사 (간단하게)
    if (!lowerCasedEmail.includes('@')) {
        Alert.alert("입력 오류", "유효한 이메일 주소를 입력해주세요.");
        return false;
    }

    if (invitations.some(inv => inv.email.toLowerCase() === lowerCasedEmail)) {
      Alert.alert("초대 실패", "이미 해당 이메일로 보낸 초대장이 있습니다.");
      return false;
    }

    const newInvitation: TrainerInvitation = {
      id: `inv_${Date.now()}`,
      email: lowerCasedEmail,
      name,
      adminId: user.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await saveInvitations([...invitations, newInvitation]);
    Alert.alert("초대 성공", `${name}(${email})님에게 트레이너 초대장을 보냈습니다.`);
    return true;
  }, [user, invitations]);

  const checkForInvitation = useCallback((email: string): TrainerInvitation | undefined => {
    const lowerCasedEmail = email.toLowerCase();
    return invitations.find(inv => inv.email.toLowerCase() === lowerCasedEmail && inv.status === 'pending');
  }, [invitations]);

  const consumeInvitation = useCallback(async (email: string) => {
    const lowerCasedEmail = email.toLowerCase();
    const newInvitations = invitations.filter(inv => inv.email.toLowerCase() !== lowerCasedEmail);
    await saveInvitations(newInvitations);
  }, [invitations]);

  return (
    <InvitationContext.Provider value={{ invitations, loading, inviteTrainer, checkForInvitation, consumeInvitation }}>
      {children}
    </InvitationContext.Provider>
  );
};

export const useInvitations = () => {
  const context = useContext(InvitationContext);
  if (!context) {
    throw new Error('useInvitations must be used within an InvitationProvider');
  }
  return context;
}; 