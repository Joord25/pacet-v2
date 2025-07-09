import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { HeaderMenu } from "./HeaderMenu";
import { NotificationMenu } from "./NotificationMenu";

type VisibleMenu = "account" | "notification" | "none";

export function HeaderRight() {
  const { signOut } = useAuth();
  const [visibleMenu, setVisibleMenu] = useState<VisibleMenu>("none");

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        onPress: signOut,
        style: "destructive",
      },
    ]);
  };

  return (
    <>
      <View style={styles.container}>
        <Pressable
          onPress={() => setVisibleMenu("notification")}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <IconSymbol
            name="bell"
            size={Platform.OS === "ios" ? 26 : 22}
            color="#1f2937"
          />
        </Pressable>
        <Pressable
          onPress={() => setVisibleMenu("account")}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <IconSymbol
            name="person.circle"
            size={Platform.OS === "ios" ? 28 : 24}
            color="#1f2937"
          />
        </Pressable>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <IconSymbol
            name="rectangle.portrait.and.arrow.right"
            size={Platform.OS === "ios" ? 24 : 22}
            color="#1f2937"
          />
        </Pressable>
      </View>

      {visibleMenu === "account" && (
        <HeaderMenu visible={true} onClose={() => setVisibleMenu("none")} />
      )}

      {visibleMenu === "notification" && (
        <NotificationMenu
          visible={true}
          onClose={() => setVisibleMenu("none")}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginRight: 16,
  },
}); 