import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type AuthTextInputProps = TextInputProps & {
  label: string;
};

export function AuthTextInput({ label, ...props }: AuthTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={Colors.pacet.lightText}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.pacet.mediumText,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 16,
    color: Colors.pacet.darkText,
    backgroundColor: Colors.pacet.white,
    borderWidth: 1,
    borderColor: Colors.pacet.border,
    borderRadius: 8,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: Colors.pacet.primary,
    borderWidth: 2,
    paddingHorizontal: 15,
  },
}); 