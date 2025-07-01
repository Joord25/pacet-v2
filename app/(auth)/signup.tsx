import { AuthButton } from "@/components/auth/AuthButton";
import { AuthTextInput } from "@/components/auth/AuthTextInput";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.formCard}>
          <ThemedText style={styles.formTitle}>회원가입</ThemedText>
          <AuthTextInput
            label="이름"
            placeholder="홍길동"
            autoCapitalize="words"
          />
          <AuthTextInput
            label="이메일 (ID)"
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AuthTextInput
            label="비밀번호"
            placeholder="••••••••"
            secureTextEntry
          />
          <AuthTextInput
            label="비밀번호 확인"
            placeholder="••••••••"
            secureTextEntry
          />
          <AuthButton title="회원가입 완료" onPress={() => {}} />
        </View>

        <TouchableOpacity style={styles.link} onPress={() => router.back()}>
          <ThemedText style={styles.linkText}>
            이미 계정이 있으신가요?{" "}
            <ThemedText style={styles.linkTextBold}>로그인</ThemedText>
          </ThemedText>
        </TouchableOpacity>
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