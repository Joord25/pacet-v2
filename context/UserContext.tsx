import { allUsers } from '@/constants/mocks/users'; // 초기 목업 데이터
import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

const USER_STORAGE_KEY = '@pacet-time-manager-users';

// Context가 가지게 될 값의 타입 정의
interface UserContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  addUser: (newUser: Omit<User, 'id' | 'role' | 'status'>) => User;
  updateUserStatus: (userId: string, status: 'active' | 'inactive') => void;
  addUserSessions: (userId: string, sessionsToAdd: number) => void;
  assignTrainerToMember: (memberId: string, trainerId: string) => void; // 함수 추가
  promoteToTrainer: (userId: string) => void;
  isDataLoaded: boolean;
}

// Context 생성 (초기값은 undefined)
const UserContext = createContext<UserContextType | undefined>(undefined);

// Context를 사용하기 쉽게 만들어주는 커스텀 훅
export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

// Provider 컴포넌트
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  // 실제 사용자 데이터는 useState로 관리
  // 🚨 변경: 초기값을 빈 배열로 설정하고, 로딩 상태를 관리
  const [users, setUsers] = useState<User[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 1. 앱 시작 시 AsyncStorage에서 데이터 로드
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const storedUsersJSON = await AsyncStorage.getItem(USER_STORAGE_KEY);
        let usersFromStorage: User[] = [];
        if (storedUsersJSON) {
          usersFromStorage = JSON.parse(storedUsersJSON);
        } else {
          usersFromStorage = allUsers;
        }

        setUsers(usersFromStorage);
        
      } catch (e) {
        console.error("Failed to load users from storage", e);
        // 에러 발생 시 목업 데이터로 폴백
        setUsers(allUsers);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadUsers();
  }, []);

  // 2. users 상태가 변경될 때마다 AsyncStorage에 자동 저장
  useEffect(() => {
    // 데이터가 완전히 로드된 후에만 저장 로직 실행
    if (isDataLoaded) {
      AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    }
  }, [users, isDataLoaded]);

  const addUser = (newUser: Omit<User, 'id' | 'role' | 'status'>): User => {
    const userWithDefaults: User = {
      ...newUser,
      id: `user_${Date.now()}`,
      role: 'member', // 회원가입은 기본적으로 'member'
      status: 'active',
    };
    setUsers(currentUsers => [...currentUsers, userWithDefaults]);
    return userWithDefaults;
  };

  const updateUserStatus = useCallback((userId: string, status: 'active' | 'inactive') => {
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === userId ? { ...user, status } : user
      )
    );
    // 향후 Supabase 연동 시, 여기에 API 호출 로직 추가
    // 예: const { error } = await supabase.from('users').update({ status }).eq('id', userId)
  }, []);

  const addUserSessions = useCallback((userId: string, sessionsToAdd: number) => {
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === userId 
          ? { ...user, ptTotalSessions: (user.ptTotalSessions || 0) + sessionsToAdd }
          : user
      )
    );
  }, []);

  const assignTrainerToMember = useCallback((memberId: string, trainerId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === memberId ? { ...u, assignedTrainerId: trainerId } : u
      )
    );
  }, []);

  const promoteToTrainer = useCallback((userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === userId ? { ...u, role: 'trainer' } : u
      )
    );
  }, []);

  const value = {
    users,
    isDataLoaded,
    setUsers,
    addUser,
    updateUserStatus,
    addUserSessions,
    assignTrainerToMember,
    promoteToTrainer,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}; 