import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

interface HeaderButtonProps {
  tintColor?: string;
}

export function HeaderBackButton({ tintColor }: HeaderButtonProps) {
  const router = useRouter();
  const navigation = useNavigation();

  // canGoBack()은 네비게이션 스택에 돌아갈 화면이 있는지 확인합니다.
  if (!navigation.canGoBack()) {
    return null;
  }

  return (
    <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
      <Ionicons name="chevron-back" size={24} color={tintColor} />
    </TouchableOpacity>
  );
} 