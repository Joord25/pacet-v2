import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ContractProvider } from '@/context/ContractContext';
import { InvitationProvider } from '@/context/InvitationContext';
import { SessionProvider, useSessions } from '@/context/SessionContext';
import { UserProvider, useUsers } from '@/context/UserContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';

SplashScreen.preventAutoHideAsync();

// 알림 핸들러 설정: 앱이 실행 중일 때도 알림을 표시
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    // iOS 14+ 에서 배너와 목록에 알림을 표시하기 위한 속성입니다.
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('알림을 받으려면 푸시 알림 권한을 허용해주세요!');
    return;
  }
  // 실제 푸시 토큰은 여기서 얻을 수 있으나, 이 프로젝트에서는 로컬 알림만 사용하므로 토큰을 사용하지는 않습니다.
  // token = (await Notifications.getExpoPushTokenAsync()).data;
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}


function RootLayoutNav() {
  const { isLoading: isAuthLoading } = useAuth();
  const { isDataLoaded: isUserLoaded } = useUsers();
  const { isDataLoaded: isSessionLoaded } = useSessions();
  // ContractContext 로딩 상태도 필요하다면 추가할 수 있습니다.

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

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
            <InvitationProvider>
              <SessionProvider>
                <ContractProvider>
                  <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    {children}
                  </ThemeProvider>
                </ContractProvider>
              </SessionProvider>
            </InvitationProvider>
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
