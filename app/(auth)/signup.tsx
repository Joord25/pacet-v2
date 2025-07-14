import { AuthButton } from "@/components/auth/AuthButton";
import { AuthTextInput } from "@/components/auth/AuthTextInput";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useContracts } from "@/context/ContractContext";
import { useInvitations } from "@/context/InvitationContext";
import { useUsers } from "@/context/UserContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const { addUser, users, promoteToTrainer } = useUsers();
  const { linkInvitation, contracts } = useContracts();
  const { checkForInvitation, consumeInvitation } = useInvitations();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invitationInfo, setInvitationInfo] = useState<string | null>(null);

  useEffect(() => {
    const checkInvitation = () => {
      if (!email) {
        setInvitationInfo(null);
        return;
      }

      // 1. 트레이너 초대 먼저 확인
      const trainerInvitation = checkForInvitation(email);
      if (trainerInvitation) {
        setInvitationInfo(`👑 관리자로부터 온 트레이너 초대장입니다!`);
        return; // 트레이너 초대가 있으면 여기서 종료
      }

      // 2. 회원 초대 확인
      const memberInvitation = contracts.find(c =>
        c.invitedEmail?.toLowerCase() === email.toLowerCase() &&
        c.status === 'invited'
      );

      if (memberInvitation) {
        const trainer = users.find(u => u.id === memberInvitation.trainerId);
        const trainerName = trainer ? trainer.name : '트레이너';
        setInvitationInfo(`✨ ${trainerName}님으로부터 온 초대장이 있습니다!`);
      } else {
        setInvitationInfo(null);
      }
    };

    // Debounce check
    const handler = setTimeout(() => {
      checkInvitation();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [email, contracts, users, checkForInvitation]);

  const handleSignUp = () => {
    // 1. Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("입력 오류", "모든 필드를 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("입력 오류", "비밀번호가 일치하지 않습니다.");
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("입력 오류", "유효한 이메일 주소를 입력해주세요.");
      return;
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        Alert.alert("가입 실패", "이미 사용 중인 이메일입니다.");
        return;
    }

    // 2. Add user
    const newUser = addUser({ name, email, password });

    // 3. 계약 또는 초대 처리
    const trainerInvitation = checkForInvitation(newUser.email);
    if (trainerInvitation) {
      promoteToTrainer(newUser.id);
      consumeInvitation(newUser.email);
      Alert.alert(
        "트레이너 등록 완료",
        "초대받은 트레이너로 가입되었습니다. 로그인 페이지로 이동합니다.",
        [{ text: "확인", onPress: () => router.back() }]
      );
      return; // 트레이너 가입 시 아래 로직은 실행하지 않음
    }

    // 기존 회원 초대 로직
    linkInvitation(newUser.email, newUser.id);
    
    // 4. Notify and navigate
    Alert.alert(
      "회원가입 성공",
      "회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.",
      [
        {
          text: "확인",
          onPress: () => router.back(),
        },
      ]
    );
  };

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
            value={name}
            onChangeText={setName}
          />
          <AuthTextInput
            label="이메일 (ID)"
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.invitationContainer}>
            {invitationInfo && <ThemedText style={styles.invitationText}>{invitationInfo}</ThemedText>}
          </View>
          <AuthTextInput
            label="비밀번호"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <AuthTextInput
            label="비밀번호 확인"
            placeholder="••••••••"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <AuthButton title="회원가입 완료" onPress={handleSignUp} />
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
  invitationContainer: {
    height: 20, // 항상 고정된 높이를 차지하도록 설정
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: -8,
  },
  invitationText: {
    textAlign: 'center',
    color: Colors.pacet.primary,
    fontWeight: '600'
  }
}); 