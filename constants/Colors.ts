/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  pacet: {
    primary: '#FF773A',
    primaryDark: '#E66324', // for hover/press effect
    primaryMuted: '#FFEFE7', // primary 색상의 연한 버전
    lightBg: '#F7F8FA', // bg-orange-50
    darkBg: '#1A1A1A', // gray-900
    darkText: '#1f2937', // gray-800, for main text
    mediumText: '#4b5563', // gray-600, for labels
    lightText: '#6b7280', // gray-500, for placeholders
    border: '#d1d5db', // gray-300
    white: '#FFFFFF',
    warning: '#d97706', // amber-600
    warningMuted: '#fef3c7', // amber-100
    info: '#3B82F6', // blue-500
    infoMuted: '#DBEAFE', // blue-100
    success: '#16A34A', // green-600
    successMuted: '#DCFCE7', // green-100
    gray: '#E5E7EB', // coolGray-200
    lightGray: '#F3F4F6', // coolGray-100
  },
  trainer: {
    gradientStart: '#0A3442',
    gradientEnd: '#245B6E',
    buttonBg: '#1e293b', // slate-800
    cardBg: '#FFFFFF',
    textWhite: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.7)',
  },
  light: {
    text: '#11181C',
    textMuted: '#687076',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    gray: '#f3f4f6',
    success: '#16a34a',
    successMuted: '#dcfce7',
    error: '#dc2626',
    errorMuted: '#fee2e2',
  },
  dark: {
    text: '#ECEDEE',
    textMuted: '#9b9b9b',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    gray: '#374151',
    success: '#4ade80',
    successMuted: '#166534',
    error: '#f87171',
    errorMuted: '#991b1b',
  },
};
