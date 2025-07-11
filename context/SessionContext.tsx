import { allSessions, Session } from "@/constants/mocks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

interface SessionContextType {
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  addSession: (sessionData: Omit<Session, "sessionId">) => void;
  updateSession: (sessionId: string, updates: Partial<Omit<Session, 'sessionId'>>) => void;
  updateSessionStatus: (sessionId: string, status: Session['status']) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);
const SESSIONS_STORAGE_KEY = "@pacet_sessions";

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const storedSessions = await AsyncStorage.getItem(SESSIONS_STORAGE_KEY);
        if (storedSessions) {
          setSessions(JSON.parse(storedSessions));
        } else {
          // 데이터가 없으면 목 데이터를 초기값으로 설정하고 저장
          setSessions(allSessions);
          await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(allSessions));
        }
      } catch (e) {
        console.error("Failed to load sessions.", e);
        // 에러 발생 시 목 데이터로 폴백
        setSessions(allSessions);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  useEffect(() => {
    // isLoading 중이거나 sessions가 비어있을 때는 저장하지 않음
    if (!isLoading && sessions.length > 0) {
      AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions, isLoading]);


  const addSession = (sessionData: Omit<Session, "sessionId">) => {
    const newSession: Session = {
      ...sessionData,
      sessionId: `session_${Date.now()}`,
      status: "pending",
    };
    setSessions((prev) => [...prev, newSession]);
    Alert.alert(
      "예약 요청 완료",
      `${sessionData.sessionDate} ${sessionData.sessionTime}으로 예약 요청을 보냈습니다.`
    );
  };

  const updateSession = (sessionId: string, updates: Partial<Omit<Session, 'sessionId'>>) => {
    let originalSession: Session | undefined;
    setSessions(prevSessions => {
      originalSession = prevSessions.find(s => s.sessionId === sessionId);
      return prevSessions.map(session =>
        session.sessionId === sessionId
          ? { ...session, ...updates }
          : session
      );
    });

    if (updates.status && originalSession) {
      const { sessionDate, sessionTime } = originalSession;
      if (updates.status === 'confirmed') {
        Alert.alert(
          "예약 수락",
          `${sessionDate} ${sessionTime} 수업이 확정되었습니다.`
        );
      } else if (updates.status === 'cancelled' || updates.status === 'no-show') {
        Alert.alert(
          "예약 취소/변경",
          `${sessionDate} ${sessionTime} 수업이 취소 또는 불참 처리되었습니다.`
        );
      }
    }
  };

  const updateSessionStatus = (sessionId: string, status: Session['status']) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.sessionId === sessionId ? { ...session, status } : session
      )
    );
  };

  const value = { sessions, setSessions, addSession, updateSession, updateSessionStatus };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export function useSessions() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessions must be used within a SessionProvider");
  }
  return context;
} 