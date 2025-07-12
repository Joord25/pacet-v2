import { HeaderBackButton } from "@/components/common/HeaderBackButton";
import { HeaderRight } from "@/components/common/HeaderRight";
import { Stack } from "expo-router";
import React from "react";

export default function TrainerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "PACET",
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="report"
        options={{
          headerTitle: "회원 리포트",
          headerLeft: ({ tintColor }) => (
            <HeaderBackButton tintColor={tintColor} />
          ),
        }}
      />
    </Stack>
  );
} 