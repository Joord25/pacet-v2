import { HeaderRight } from "@/components/common/HeaderRight";
import { Stack } from "expo-router";
import React from "react";

export default function MemberLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "PACET",
          headerRight: () => <HeaderRight />,
        }}
      />
    </Stack>
  );
}
