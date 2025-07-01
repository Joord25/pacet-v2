import { Colors } from '@/constants/Colors';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type AuthButtonProps = {
  onPress: () => void;
  title: string;
};

export function AuthButton({ onPress, title }: AuthButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: Colors.pacet.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonPressed: {
    backgroundColor: Colors.pacet.primaryDark,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.pacet.white,
  },
}); 