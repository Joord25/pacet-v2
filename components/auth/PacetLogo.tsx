import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export function PacetLogo() {
  return <Text style={styles.pacetTitle}>PACET</Text>;
}

const styles = StyleSheet.create({
  pacetTitle: {
    fontSize: 80,
    fontWeight: '900',
    color: Colors.pacet.primary,
    fontStyle: 'italic',
    letterSpacing: -2,
    lineHeight: 80,
  },
}); 