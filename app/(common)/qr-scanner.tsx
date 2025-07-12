import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { useSessions } from "@/context/SessionContext";
import {
  SCANNER_FRAME_SIZE,
  qrScannerStyles,
} from "@/styles/qrScannerStyles";
import { Session } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function QRScannerScreen() {
  const router = useRouter();
  const [isScanSuccess, setIsScanSuccess] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // --- Animations ---
  const scanLineY = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const overlayScale = useSharedValue(1.1);

  useEffect(() => {
    scanLineY.value = withRepeat(
      withTiming(SCANNER_FRAME_SIZE - 2, {
        duration: 2500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [scanLineY]);

  const { user } = useAuth();
  const { sessions, updateSession } = useSessions();

  useEffect(() => {
    let backTimer: ReturnType<typeof setTimeout>;
    if (isScanSuccess) {
      overlayOpacity.value = withTiming(1, { duration: 300 });
      overlayScale.value = withTiming(1, { duration: 300 });

      backTimer = setTimeout(() => {
        if (router.canGoBack()) {
          router.back();
        }
      }, 2000);
    }
    return () => {
      if (backTimer) clearTimeout(backTimer);
    };
  }, [isScanSuccess, overlayOpacity, overlayScale, router]);

  const processCheckIn = (session: Session) => {
    const currentUserRole = user?.role;
    const now = new Date();
    // 세션 시간을 정확히 파악하기 위해 날짜와 시간을 합쳐 Date 객체 생성
    const sessionTime = new Date(`${session.sessionDate}T${session.sessionTime}`);
    const isLate = now > sessionTime;

    let newStatus: Session['status'] | null = null;
    let checkInData: Partial<Session> = {};
  
    if (currentUserRole === 'member') {
      checkInData.memberCheckInTime = now.toISOString();
      if (session.status === 'confirmed') {
        newStatus = isLate ? 'late' : 'member-attended';
        if (isLate) {
          Alert.alert("지각 처리", "예정된 수업 시간이 지나 지각으로 처리되었습니다.");
        }
      } else if (session.status === 'trainer-attended') {
        newStatus = 'completed';
      }
    } else if (currentUserRole === 'trainer') {
      checkInData.trainerCheckInTime = now.toISOString();
      if (session.status === 'confirmed') {
        newStatus = 'trainer-attended';
      } else if (session.status === 'member-attended' || session.status === 'late') {
        newStatus = 'completed';
      }
    }
  
    if (newStatus) {
      checkInData.status = newStatus;
      // 상태와 체크인 시간을 한번에 업데이트
      updateSession(session.sessionId, checkInData);
      setIsScanSuccess(true);
    } else {
      Alert.alert("알림", "이미 출석 처리되었거나, 처리할 수 없는 상태의 수업입니다.");
      setScanned(false);
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    const now = new Date();
    const currentUserRole = user?.role;
  
    if (!user || (currentUserRole !== 'member' && currentUserRole !== 'trainer')) {
      Alert.alert("출석체크 실패", "로그인 정보가 올바르지 않습니다.");
      setScanned(false);
      return;
    }
  
    // --- 테스트 출석 버튼을 위한 특별 로직 ---
    if (data === 'test-qr-from-simulator') {
      // 테스트 가능한 모든 세션 (확정, 상대방 출석 상태)
      const checkableSessions = sessions.filter(s => {
        let isUserSession = false;
        if (currentUserRole === 'member') {
          isUserSession = s.memberId === user.id && (s.status === 'confirmed' || s.status === 'trainer-attended');
        } else { // trainer
          isUserSession = s.trainerId === user.id && (s.status === 'confirmed' || s.status === 'member-attended');
        }
        return isUserSession;
      });

      if (checkableSessions.length === 0) {
        Alert.alert("테스트 실패", "테스트할 수 있는 '확정' 또는 '상대방 출석' 상태의 수업이 없습니다.");
        setScanned(false);
        return;
      }

      // 현재 시간과 가장 가까운 세션을 찾는다 (과거/미래 무관)
      checkableSessions.sort((a, b) => {
        const aTime = new Date(`${a.sessionDate}T${a.sessionTime}`).getTime();
        const bTime = new Date(`${b.sessionDate}T${b.sessionTime}`).getTime();
        return Math.abs(now.getTime() - aTime) - Math.abs(now.getTime() - bTime);
      });
      
      const targetSession = checkableSessions[0];
      
      processCheckIn(targetSession);
      return;
    }
    
    // --- 실제 QR 스캔 로직 ---
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
  
    const targetSession = sessions.find(s => {
      const sessionTime = new Date(`${s.sessionDate}T${s.sessionTime}`);
      const isToday = s.sessionDate === todayStr;
      const isValidTime = now.getTime() >= sessionTime.getTime() - 60 * 60 * 1000 && now.getTime() <= sessionTime.getTime() + 60 * 60 * 1000;
      
      if (currentUserRole === 'member') {
        return s.memberId === user.id && isToday && isValidTime && (s.status === 'confirmed' || s.status === 'trainer-attended');
      }
      if (currentUserRole === 'trainer') {
        return s.trainerId === user.id && isToday && isValidTime && (s.status === 'confirmed' || s.status === 'member-attended');
      }
      return false;
    });
  
    if (!targetSession) {
      Alert.alert("출석할 수업 없음", "지금 출석체크를 할 수 있는 예약된 수업이 없습니다.\n(오늘, 수업 시간 1시간 전후)");
      setScanned(false);
      return;
    }
  
    processCheckIn(targetSession);
  };

  const scanLineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const successOverlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    transform: [{ scale: overlayScale.value }],
  }));

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={qrScannerStyles.permissionContainer}>
        <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>
          카메라를 사용하려면 권한을 허용해주세요.
        </ThemedText>
        <Button onPress={requestPermission} title="권한 허용하기" />
      </View>
    );
  }

  return (
    <View style={qrScannerStyles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      <View style={qrScannerStyles.overlay}>
        <View style={qrScannerStyles.header}>
          <ThemedText style={qrScannerStyles.title}>출석 체크</ThemedText>
          <ThemedText style={qrScannerStyles.subtitle}>
            상대방의 QR 코드를 화면 중앙에 맞춰주세요.
          </ThemedText>
        </View>

        <View style={qrScannerStyles.scannerFrame}>
          <Animated.View style={[qrScannerStyles.scanLine, scanLineAnimatedStyle]}>
            <LinearGradient
              colors={["transparent", "rgba(255, 92, 0, 0.8)", "transparent"]}
              style={{ width: "100%", height: "100%" }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>
          <View style={[qrScannerStyles.corner, qrScannerStyles.topLeft]} />
          <View style={[qrScannerStyles.corner, qrScannerStyles.topRight]} />
          <View style={[qrScannerStyles.corner, qrScannerStyles.bottomLeft]} />
          <View style={[qrScannerStyles.corner, qrScannerStyles.bottomRight]} />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.cancelButton} onPress={() => router.back()}>
            <ThemedText style={styles.buttonText}>취소</ThemedText>
          </Pressable>
          {__DEV__ && (
            <Pressable
              style={[styles.cancelButton, styles.testButton]}
              onPress={() => handleBarCodeScanned({ data: 'test-qr-from-simulator' })}
            >
              <ThemedText style={styles.buttonText}>테스트 출석</ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      {isScanSuccess && (
        <Animated.View
          style={[qrScannerStyles.successOverlay, successOverlayAnimatedStyle]}
        >
          <Ionicons name="checkmark-circle" size={100} color="white" />
          <ThemedText style={qrScannerStyles.successText}>출석 확인!</ThemedText>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
  },
}); 