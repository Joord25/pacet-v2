import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SessionProvider } from '@/context/SessionContext';
import { UserProvider, useUsers } from '@/context/UserContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';

// SplashScreen을 숨기지 않도록 설정
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const { isDataLoaded } = useUsers();

  useEffect(() => {
    // 인증 상태 로딩과 사용자 데이터 로딩이 모두 끝나면 SplashScreen을 숨깁니다.
    if (!isLoading && isDataLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, isDataLoaded]);

  // 로딩이 완료될 때까지 아무것도 렌더링하지 않거나 로딩 인디케이터를 보여줄 수 있습니다.
  if (isLoading || !isDataLoaded) {
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


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <UserProvider>
          <AuthProvider>
            <SessionProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <RootLayoutNav />
              </ThemeProvider>
            </SessionProvider>
          </AuthProvider>
        </UserProvider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
}
