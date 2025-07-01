import { HeaderBackButton } from "@/components/common/HeaderBackButton";
import { HeaderRight } from "@/components/common/HeaderRight";
import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.pacet.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
        headerRight: ({ tintColor }) => <HeaderRight tintColor={tintColor} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "관리자 대시보드",
        }}
      />
    </Stack>
  );
} 