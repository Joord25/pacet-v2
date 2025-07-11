import { ThemedText } from "@/components/ThemedText";
import { Session } from "@/constants/mocks";
import { useAuth } from "@/context/AuthContext";
import { useSessions } from "@/context/SessionContext";
import {
  SCANNER_FRAME_SIZE,
  qrScannerStyles,
} from "@/styles/qrScannerStyles";
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
  const { sessions, updateSessionStatus } = useSessions();

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

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentUserRole = user?.role;
  
    if (!user || (currentUserRole !== 'member' && currentUserRole !== 'trainer')) {
      Alert.alert("출석체크 실패", "출석체크는 회원 또는 트레이너 계정으로만 가능합니다.");
      setScanned(false);
      return;
    }
  
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
      Alert.alert("출석할 수업 없음", "지금 출석체크를 할 수 있는 예약된 수업이 없습니다.");
      setScanned(false);
      return;
    }
  
    let newStatus: Session['status'] | null = null;
  
    if (currentUserRole === 'member') {
      if (targetSession.status === 'confirmed') newStatus = 'member-attended';
      else if (targetSession.status === 'trainer-attended') newStatus = 'completed';
    } else if (currentUserRole === 'trainer') {
      if (targetSession.status === 'confirmed') newStatus = 'trainer-attended';
      else if (targetSession.status === 'member-attended') newStatus = 'completed';
    }
  
    if (newStatus) {
      updateSessionStatus(targetSession.sessionId, newStatus);
      setIsScanSuccess(true);
    } else {
      // 이미 출석한 경우 등 newStatus가 할당되지 않은 경우
      Alert.alert("알림", "이미 출석 처리되었습니다.");
      setScanned(false);
    }
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