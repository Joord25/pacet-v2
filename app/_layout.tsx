import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SessionProvider } from "@/context/SessionContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoading) return; // 로딩 중에는 아무것도 하지 않음

    const inAuthGroup = segments[0] === "(auth)";

    // 사용자가 없고, 인증 그룹에 있지 않다면...
    if (!user && !inAuthGroup) {
      // 로그인 페이지로 리디렉션합니다.
      router.replace("/(auth)");
    }
    // 사용자가 있고, 인증 그룹에 있다면...
    else if (user && inAuthGroup) {
      // 역할에 맞는 홈 화면으로 리디렉션합니다.
      router.replace(`/(${user.role})`);
    }
  }, [user, segments, isLoading, router]);

  if (isLoading) {
    // 로딩 중에는 아무것도 렌더링하지 않거나 스플래시 화면을 유지할 수 있습니다.
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(member)" options={{ headerShown: false }} />
      <Stack.Screen name="(trainer)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen name="(common)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <MenuProvider>
      <AuthProvider>
        <SessionProvider>
          <RootLayoutNav />
        </SessionProvider>
      </AuthProvider>
    </MenuProvider>
  );
}
