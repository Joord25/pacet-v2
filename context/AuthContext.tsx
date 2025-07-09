import { allUsers, User } from "@/constants/mocks";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

// 1. 컨텍스트에서 제공할 값들의 타입을 정의합니다.
interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  isLoading: boolean;
}

// 2. 컨텍스트를 생성합니다. 초기값은 undefined로 설정합니다.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. 컨텍스트를 쉽게 사용할 수 있게 해주는 커스텀 훅을 만듭니다.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// 4. AuthProvider 컴포넌트를 정의합니다.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 앱 시작 시 사용자 상태 확인 (나중에는 AsyncStorage 등에서 토큰을 확인할 수 있습니다)
  useEffect(() => {
    // 지금은 로딩 상태만 관리합니다.
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // --- 나중에 이 부분만 실제 백엔드 API 호출로 변경하면 됩니다. ---
    const foundUser = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      // 로그인 성공 시, 역할에 맞는 페이지로 이동시킵니다.
      // router.replace(`/(${foundUser.role})`); // 화면 전환 로직 제거
      return true;
    }
    // -------------------------------------------------------------
    return false;
  };

  const signOut = () => {
    setUser(null);
    // 로그아웃 시, 로그인 페이지로 이동시킵니다.
    // router.replace("/(auth)"); // 화면 전환 로직 제거
  };

  // 로딩 중에는 스플래시 화면이나 로딩 인디케이터를 보여주는 것이 좋습니다.
  // 여기서는 children을 렌더링하지 않아, 화면 전환이 완료될 때까지 흰 화면이 보이게 됩니다.
  if (isLoading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
} 