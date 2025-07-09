import { AuthButton } from "@/components/auth/AuthButton";
import { AuthTextInput } from "@/components/auth/AuthTextInput";
import { PacetLogo } from "@/components/auth/PacetLogo";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const success = await signIn(email, password);
    if (!success) {
      Alert.alert("로그인 실패", "이메일 또는 비밀번호를 확인해주세요.");
    }
    // 로그인 성공 시 리디렉션은 AuthProvider가 자동으로 처리합니다.
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
    backgroundColor: "#F7F8FA",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 8,
  },
  formCard: {
    padding: 24,
    backgroundColor: "#FFFFFF",
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
    color: "#1C1C1E",
    marginBottom: 24,
  },
  link: {
    marginTop: 24,
  },
  linkText: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: "bold",
    color: "#007AFF",
  },
}); 