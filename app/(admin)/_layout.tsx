import { HeaderBackButton } from "@/components/common/HeaderBackButton";
import { HeaderRight } from "@/components/common/HeaderRight";
import { Stack } from "expo-router";
import React from "react";

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "관리자",
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="user-management"
        options={{
          headerTitle: "트레이너 관리",
          headerLeft: ({ tintColor }) => (
            <HeaderBackButton tintColor={tintColor} />
          ),
          headerRight: () => <HeaderRight />, // 👈 트레이너 관리 페이지에도 헤더 메뉴 추가
        }}
      />
    </Stack>
  );
} 