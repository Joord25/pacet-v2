import { mockSessions } from '@/constants/mocks/sessions';
import { Session } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const SESSIONS_STORAGE_KEY = '@pacet_sessions'; // 🚨 키 이름 변경

export interface SessionContextType {
  sessions: Session[];
  addSession: (session: Omit<Session, 'sessionId'>) => Promise<void>;
  updateSession: (sessionId: string, data: Partial<Omit<Session, 'sessionId'>>) => Promise<void>;
  updateSessionStatus: (sessionId: string, newStatus: Session['status']) => Promise<void>;
  acceptRequest: (sessionId:string) => Promise<void>;
  rejectRequest: (sessionId: string) => Promise<void>;
  cancelSession: (sessionId: string) => Promise<void>;
  getSessionById: (sessionId: string) => Session | undefined;
  isDataLoaded: boolean; // 🚨 isDataLoaded 추가
  requestSession: (newSessionData: Omit<Session, 'sessionId' | 'status'>) => Promise<void>;
}

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined
);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const { user } = useAuth(); // 현재 로그인한 사용자 정보
  const [isDataLoaded, setIsDataLoaded] = useState(false); // 🚨 isLoading -> isDataLoaded

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const storedSessions = await AsyncStorage.getItem(SESSIONS_STORAGE_KEY);
        if (storedSessions) {
          setSessions(JSON.parse(storedSessions));
        } else {
          setSessions(mockSessions);
        }
      } catch (e) {
        console.error('Failed to load sessions:', e);
        setSessions(mockSessions); // Fallback to mock data
      } finally {
        setIsDataLoaded(true); // 🚨 로딩 완료 설정
      }
    };
    loadSessions();
  }, []);

  useEffect(() => {
    // 🚨 isDataLoaded 사용
    if (isDataLoaded) {
      AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions, isDataLoaded]);


  const addSession = useCallback(async (sessionData: Omit<Session, 'sessionId'>) => {
    const newSession: Session = {
      ...sessionData,
      sessionId: `session_${Date.now()}`, // 🚨 sessionId로 변경
    };
    setSessions(currentSessions => [...currentSessions, newSession]);
  }, []);

  const updateSession = useCallback(async (sessionId: string, data: Partial<Omit<Session, 'sessionId'>>) => {
    setSessions(currentSessions =>
      currentSessions.map((s) =>
        s.sessionId === sessionId ? { ...s, ...data } : s
      )
    );
  }, []);

  const updateSessionStatus = useCallback(async (sessionId: string, newStatus: Session['status']) => {
    setSessions(currentSessions =>
      currentSessions.map((s) =>
        s.sessionId === sessionId ? { ...s, status: newStatus } : s // 🚨 sessionId로 변경
      )
    );
  }, []);

  const requestSession = async (newSessionData: Omit<Session, 'sessionId' | 'status'>) => {
    try {
      const newSession: Session = {
        ...newSessionData,
        sessionId: `session_${Date.now()}_${Math.random()}`,
        status: 'requested',
      };
      const updatedSessions = [...sessions, newSession];
      setSessions(updatedSessions);
      await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));
    } catch (error) {
      console.error("Error requesting session:", error);
      // TODO: 사용자에게 오류 알림
    }
  };

  const scheduleCheckinReminder = async (sessionId: string) => {
    const session = sessions.find(s => s.sessionId === sessionId);
    if (!session) return;

    const triggerDate = new Date(`${session.sessionDate}T${session.sessionTime}`);
    triggerDate.setMinutes(triggerDate.getMinutes() - 10);

    // If the trigger time is in the past, don't schedule.
    if (triggerDate < new Date()) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "수업 시작 10분 전",
        body: "출석 체크를 잊지 마세요!",
        data: { sessionId },
      },
      // @ts-ignore - Linter가 trigger 타입을 정확히 인식하지 못하는 문제가 있어 임시 조치
      trigger: triggerDate,
    });
  };

  const acceptRequest = useCallback(async (sessionId: string) => {
    await updateSessionStatus(sessionId, 'confirmed');
    await scheduleCheckinReminder(sessionId);
  }, [updateSessionStatus, sessions]);

  const rejectRequest = useCallback(async (sessionId: string) => {
    setSessions(currentSessions =>
      currentSessions.filter(s => s.sessionId !== sessionId)
    );
  }, []);

  const cancelSession = useCallback(async (sessionId: string) => {
    await updateSessionStatus(sessionId, 'cancelled');
  }, [updateSessionStatus]);

  const getSessionById = useCallback((sessionId: string) => {
    return sessions.find((s) => s.sessionId === sessionId); // 🚨 sessionId로 변경
  }, [sessions]);

  const value = { 
    sessions, 
    addSession, 
    updateSession,
    updateSessionStatus, // 🚨 이름 변경
    acceptRequest,
    rejectRequest,
    cancelSession,
    getSessionById, 
    isDataLoaded, // 🚨 추가
    requestSession, // 컨텍스트에 추가
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export function useSessions() {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessions must be used within a SessionProvider");
  }
  return context;
} 