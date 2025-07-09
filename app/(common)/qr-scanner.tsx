import { ThemedText } from "@/components/ThemedText";
import {
  SCANNER_FRAME_SIZE,
  qrScannerStyles as styles,
} from "@/styles/qrScannerStyles";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, View } from "react-native";
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

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);
    // In a real app, you'd validate the QR code data here
    // alert(`QR Code with type ${type} and data ${data} has been scanned!`);
    setIsScanSuccess(true);
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
      <View style={styles.permissionContainer}>
        <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>
          카메라를 사용하려면 권한을 허용해주세요.
        </ThemedText>
        <Button onPress={requestPermission} title="권한 허용하기" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      <View style={styles.overlay}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>출석 체크</ThemedText>
          <ThemedText style={styles.subtitle}>
            상대방의 QR 코드를 화면 중앙에 맞춰주세요.
          </ThemedText>
        </View>

        <View style={styles.scannerFrame}>
          <Animated.View style={[styles.scanLine, scanLineAnimatedStyle]}>
            <LinearGradient
              colors={["transparent", "rgba(255, 92, 0, 0.8)", "transparent"]}
              style={{ width: "100%", height: "100%" }}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <ThemedText style={styles.cancelButtonText}>취소</ThemedText>
        </Pressable>
      </View>

      {isScanSuccess && (
        <Animated.View
          style={[styles.successOverlay, successOverlayAnimatedStyle]}
        >
          <Ionicons name="checkmark-circle" size={100} color="white" />
          <ThemedText style={styles.successText}>출석 확인!</ThemedText>
        </Animated.View>
      )}
    </View>
  );
} 