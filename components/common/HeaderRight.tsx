import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

interface HeaderButtonProps {
  tintColor?: string;
}

export function HeaderRight({ tintColor }: HeaderButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "로그아웃",
        onPress: () => {
          // replace를 사용하면 이전 화면으로 돌아올 수 없게 만듭니다.
          router.replace("/(auth)");
        },
        style: "destructive",
      },
    ]);
  };

  const handleAccount = () => {
    // TODO: 계정 관리 화면으로 이동하는 로직 추가
    Alert.alert("계정 관리", "계정 관리 화면으로 이동합니다.");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleAccount} style={styles.button}>
        <Ionicons name="person-circle-outline" size={26} color={tintColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Ionicons name="log-out-outline" size={26} color={tintColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    gap: 16,
  },
  button: {
    padding: 4,
  },
}); 