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
    </Stack>
  );
} 