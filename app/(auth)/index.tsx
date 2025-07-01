import { AuthButton } from "@/components/auth/AuthButton";
import { AuthTextInput } from "@/components/auth/AuthTextInput";
import { PacetLogo } from "@/components/auth/PacetLogo";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { mockUsers } from "@/constants/mockData";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const user = mockUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (user) {
      // 로그인 성공
      router.replace(`/(${user.role})`);
    } else {
      // 로그인 실패
      Alert.alert("로그인 실패", "이메일 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <PacetLogo />
          <ThemedText style={styles.subtitle}>
            시간을 지키는 문화의 시작
          </ThemedText>
        </View>

        <View style={styles.formCard}>
          <ThemedText style={styles.formTitle}>로그인</ThemedText>
          <AuthTextInput
            label="이메일 (ID)"
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <AuthTextInput
            label="비밀번호"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <AuthButton title="로그인" onPress={handleLogin} />
        </View>

        <Link href={"signup" as any} asChild>
          <TouchableOpacity style={styles.link}>
            <ThemedText style={styles.linkText}>
              계정이 없으신가요?{" "}
              <ThemedText style={styles.linkTextBold}>회원가입</ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </Link>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.pacet.lightBg,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.pacet.lightText,
    marginTop: 8,
  },
  formCard: {
    width: "100%",
    maxWidth: 400,
    padding: 24,
    backgroundColor: Colors.pacet.white,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.pacet.darkText,
    marginBottom: 24,
  },
  link: {
    marginTop: 24,
  },
  linkText: {
    textAlign: "center",
    color: Colors.pacet.mediumText,
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: "bold",
    color: Colors.pacet.primary,
  },
}); 