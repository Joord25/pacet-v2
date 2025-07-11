import { User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUsers } from "./UserContext";

const USER_STORAGE_KEY = '@pacet-time-manager-users';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { users, setUsers } = useUsers();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load user from storage", e);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      await AsyncStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    } else {
      return false;
    }
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  useEffect(() => {
    // 데이터 로딩 중에는 리디렉션 로직을 실행하지 않습니다.
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // 사용자가 로그인했고, 현재 (auth) 그룹에 있다면,
    if (user && inAuthGroup) {
      // 역할에 맞는 홈 화면으로 리디렉션합니다.
      if (user.role === 'admin') {
        router.replace('/(admin)');
      } else if (user.role === 'trainer') {
        router.replace('/(trainer)');
      } else {
        router.replace('/(member)');
      }
    } 
    // 사용자가 로그아웃했고, 현재 (auth) 그룹에 있지 않다면,
    else if (!user && !inAuthGroup) {
      // (auth) 그룹으로 리디렉션합니다.
      router.replace('/(auth)');
    }
  }, [user, segments, loading]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading: loading }}>
      {children}
    </AuthContext.Provider>
  );
} 