import { HeaderBackButton } from "@/components/common/HeaderBackButton";
import { Stack } from "expo-router";
import React from "react";

const renderHeaderLeft = ({ tintColor }: { tintColor?: string }) => (
  <HeaderBackButton tintColor={tintColor} />
);

export default function CommonLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="qr-scanner"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="schedule"
        options={{
          title: "스케줄",
          headerLeft: renderHeaderLeft,
        }}
      />
      <Stack.Screen
        name="member/[id]"
        options={{
          title: "회원 상세 정보",
          headerLeft: renderHeaderLeft,
        }}
      />
    </Stack>
  );
} 