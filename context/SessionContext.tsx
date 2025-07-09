import { allSessions, Session } from "@/constants/mocks";
import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

interface SessionContextType {
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  addSession: (sessionData: Omit<Session, "sessionId">) => void;
  updateSession: (sessionId: string, updates: Partial<Omit<Session, 'sessionId'>>) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessions, setSessions] = useState<Session[]>(allSessions);

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
          "예약 거절/취소",
          `${sessionDate} ${sessionTime} 수업이 취소되었습니다.`
        );
      }
    }
  };

  const value = { sessions, setSessions, addSession, updateSession };

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