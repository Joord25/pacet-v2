import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ContractProvider } from '@/context/ContractContext';
import { SessionProvider, useSessions } from '@/context/SessionContext';
import { UserProvider, useUsers } from '@/context/UserContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading: isAuthLoading } = useAuth();
  const { isDataLoaded: isUserLoaded } = useUsers();
  const { isDataLoaded: isSessionLoaded } = useSessions();
  // ContractContext 로딩 상태도 필요하다면 추가할 수 있습니다.

  useEffect(() => {
    // Auth, User, Session 데이터가 모두 로드되면 스플래시 화면을 숨깁니다.
    if (!isAuthLoading && isUserLoaded && isSessionLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isAuthLoading, isUserLoaded, isSessionLoaded]);

  // 필수 데이터가 로드될 때까지 로딩 인디케이터를 표시합니다.
  if (isAuthLoading || !isUserLoaded || !isSessionLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen name="(member)" options={{ headerShown: false }} />
      <Stack.Screen name="(trainer)" options={{ headerShown: false }} />
      <Stack.Screen name="(common)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// 모든 프로바이더를 올바른 순서로 래핑하는 단일 컴포넌트
function AppProviders({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <UserProvider>
          <AuthProvider>
            <SessionProvider>
              <ContractProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                  {children}
                </ThemeProvider>
              </ContractProvider>
            </SessionProvider>
          </AuthProvider>
        </UserProvider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
}


export default function RootLayout() {
  return (
    <AppProviders>
      <RootLayoutNav />
    </AppProviders>
  );
}
