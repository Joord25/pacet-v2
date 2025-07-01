import { HeaderBackButton } from "@/components/common/HeaderBackButton";
import { HeaderRight } from "@/components/common/HeaderRight";
import { Colors } from "@/constants/Colors";
import { trainerMockData } from "@/constants/mockData";
import { Stack } from "expo-router";

export default function TrainerLayout() {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: Colors.pacet.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
        headerRight: ({ tintColor }) => <HeaderRight tintColor={tintColor} />,
      })}
    >
      <Stack.Screen
        name="index"
        options={{
          title: trainerMockData.trainerName,
        }}
      />
    </Stack>
  );
} 